import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "../index";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { updatePost as update } from "../../store/postSlice";
import { useDispatch } from 'react-redux';
import Loading from '../Loading';

export default function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
    defaultValues: {
      title: post?.title || "",
      // slug: post?.$id || "",
      content: post?.content || "",
      // status: post?.status || "active",
    },
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()
  const [error, setError] = useState("")
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const allpost = useSelector((state) => state.post.AllPost)
  const submit = async (data) => {
    if (post) {
      setLoading(true);
      const formData = new FormData();

      // Append JSON data
      formData.append('title', data.title);
      formData.append('content', data.content);
      // Append file data
      formData.append('image', data.image[0]);
      const updatePost = await fetch(`${import.meta.env.VITE_BASE_URI}/api/v1/posts/${post._id}`, {
        method: "PATCH",
        body: formData,
        credentials: 'include'
      })

      if (!updatePost.ok) {
        console.error("Failed to update post:", updatePost.status, await updatePost.text());
        setLoading(false);

      } 
      const jsonPost = await updatePost.json();
      console.log("Updated Successful:", jsonPost);
      // Dispatch the updatePost action after successfully updating the post on the server
      dispatch(update({
        postId: post._id,
        title: data.title,
        content: data.content,
        image: jsonPost.data.image,
        imagePublicId: jsonPost.data.imagePublicId,
      }));
      setLoading(false);
      navigate(`/post/${jsonPost.data._id}`)
      // Other actions if needed
    } else {
      console.log("iam in else");
      setLoading(true);
      setError("");
      try {
        const formData = new FormData();

        // Append JSON data
        formData.append('title', data.title);
        formData.append('content', data.content);
        // Append file data
        formData.append('image', data.image[0]);
        const userData = await fetch(`${import.meta.env.VITE_BASE_URI}/api/v1/posts/`, {
          method: "POST",
          body: formData,
          credentials: 'include'
        });

        if (!userData.ok) {
          console.error("Server Error:", userData.status, await userData.text());
          setError("An error occurred during registration. Please try again.");
          return;
        }
        const postData = await userData.json();
        console.log("Registration Successful:", postData);
        navigate(`/post/${postData.data._id}`);
      } catch (error) {
        console.error("Error:", error.message);
        setError("An unexpected error occurred. Please try again.");
      }
      // const file = await appwriteService.uploadFile(data.image[0]);

      // if (file) {
      //   const fileId = file.$id;
      //   data.featuredImage = fileId;
      //   console.log(userData.$id)
      //   const dbPost = await appwriteService.createPost({ ...data, userid: userData.$id });

      //   if (dbPost) {
      //     dispatch(postdata({ postData: [...postData, dbPost] }));
      //     dispatch(AllPost({ AllPost: [...allpost, dbPost] }));
      //     setLoading(false);
      //     navigate(`/post/${dbPost.$id}`);
      //   }
      // }
    }
  };

  // const slugTransform = useCallback((value) => {
  //   if (value && typeof value === "string")
  //     return value
  //       .trim()
  //       .toLowerCase()
  //       .replace(/[^a-zA-Z\d\s]+/g, "-")
  //       .replace(/\s/g, "-");

  //   return "";
  // }, []);

  // React.useEffect(() => {
  //   const subscription = watch((value, { name }) => {
  //     if (name === "title") {
  //       setValue("slug", slugTransform(value.title), { shouldValidate: true });
  //     }
  //   });

  //   return () => subscription.unsubscribe();
  // }, [watch, slugTransform, setValue]);

  return (
    <form onSubmit={handleSubmit(submit)} className={`flex flex-wrap ${loading ? 'loading' : ''}`} encType='multipart/form-data'>
      <div className="spinner">
        {loading && <Loading />}
      </div>
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        {/* <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
          }}
        /> */}
        <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })}
        />
        {post && (
          <div className="w-full mb-4">
            <img
              src={post.image}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}
        {/* <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        /> */}
        <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
