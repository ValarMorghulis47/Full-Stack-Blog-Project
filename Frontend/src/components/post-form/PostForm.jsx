import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "../index";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AllPost, updatePost as update, UserPost } from "../../store/postSlice";
import { useDispatch } from 'react-redux';
import Loading from '../Loading';
import { toggleSuccess } from "../../store/modalSlice";

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
  const [showMessage, setShowMessage] = useState(true);
  const dispatch = useDispatch()
  const [error, setError] = useState("")
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const allpost = useSelector((state) => state.post.AllPost)
  const userpost = useSelector((state) => state.post.UserPost)
  const theme = useSelector((state) => state.theme.mode);
  let mainClassName = 'flex justify-center height';
  let titleClassName = 'block text-gray-700 text-sm font-bold mb-4';
  let contentClassName = 'block text-gray-700 text-sm font-bold mb-4';
  let inputClassName = 'block text-gray-700 text-sm focus:outline-none font-bold mb-4';
  let fileClassName = 'mt-2 block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-teal-500 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-black hover:file:bg-teal-700 focus:outline-none disabled:pointer-events-none disabled:opacity-60';

  if (theme === 'dark') {
    mainClassName += ' dark:bg-gray-950';
    inputClassName += ' dark:bg-gray-900' // Add the dark mode class if the theme is dark
    titleClassName = ' dark:text-white block text-sm font-bold mb-4' // Add the dark mode class if the theme is dark
    contentClassName = ' dark:text-white block text-sm font-bold mb-4' // Add the dark mode class if the theme is dark
    fileClassName = ' file:text-white mt-2 block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-teal-500 file:py-2 file:px-4 file:text-sm file:font-semibold hover:file:bg-teal-700 focus:outline-none disabled:pointer-events-none disabled:opacity-60' // Add the dark mode class if the theme is dark
  }
  const submit = async (data) => {
    if (post) {
      setError("");
      try {
        setLoading(true);
        const formData = new FormData();

        // Append JSON data
        formData.append('title', data?.title);
        formData.append('content', data?.content);
        // Append file data
        formData.append('image', data?.image[0]);
        const updatePost = await fetch(`${import.meta.env.VITE_BASE_URI}/api/v1/posts/${post._id}`, {
          method: "PATCH",
          body: formData,
          credentials: 'include'
        })

        if (!updatePost.ok) {
          const error = await responseData.json()
          setError(error.error.message);
          setLoading(false);
        }
        const jsonPost = await updatePost.json();
        // Dispatch the updatePost action after successfully updating the post on the server
        dispatch(update({
          postId: post._id,
          title: data.title,
          content: data.content,
          image: jsonPost.data.image,
          imagePublicId: jsonPost.data.imagePublicId,
        }));
        setLoading(false);
        dispatch(toggleSuccess());
        navigate(`/post/${jsonPost.data._id}`)
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
      // Other actions if needed
    } else {
      setLoading(true);
      setError("");
      try {
        const formData = new FormData();

        // Append JSON data
        formData.append('title', data?.title);
        formData.append('content', data?.content);
        // Append file data
        formData.append('image', data?.image[0]);
        console.log(formData);
        const responseData = await fetch(`${import.meta.env.VITE_BASE_URI}/api/v1/posts/`, {
          method: "POST",
          body: formData,
          credentials: 'include'
        });

        if (!responseData.ok) {
          const error = await responseData.json()
          setError(error.error.message);
          setLoading(false);
          return;
        }
        const postData = await responseData.json();
        dispatch(AllPost([postData.data, ...allpost]));  // Update the state by adding the new post
        dispatch(UserPost(userpost ? [postData.data, ...userpost] : [postData.data]));
        navigate(`/post/${postData.data._id}`);
      } catch (error) {
        console.log(error);
        setError(error.message);
        setLoading(false);
      }
    }
  };
  React.useEffect(() => {
    if (error) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000); // Change this value to adjust the time

      return () => clearTimeout(timer); // This will clear the timer if the component unmounts before the timer finishes
    }
  }, [error]);

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
    <>
      <div style={{ height: '40px' }}>
        {showMessage && error && <p className="text-red-600 text-center">{error}</p>}
      </div>
      <form onSubmit={handleSubmit(submit)} className={`flex flex-wrap justify-center ${loading ? 'loading' : ''}`} encType='multipart/form-data'>
        <div className="spinner">
          {loading && <Loading />}
        </div>

        <div className="w-2/3 px-2">
          <label className={titleClassName}>Post Title :</label>
          <Input
            placeholder="Title"
            className={inputClassName}
            {...register("title")}
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
          {/* <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })}
        /> */}
          <label className={contentClassName}>Post Image</label>
          <input id="example1" type="file" className="mt-2 block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-teal-500 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-teal-700 focus:outline-none disabled:pointer-events-none disabled:opacity-60" {...register("image")} />
          {post && (
            <div className="w-full mb-4 mt-4">
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
          <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full mt-4">
            {post ? "Update" : "Submit"}
          </Button>
        </div>
      </form>
    </>
  );
}
