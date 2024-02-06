import React from 'react'
import { Container, Logo, LogoutBtn } from '../index'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toggleTheme } from '../../store/darkmodeSlice'
import "../../App.css"
function Header() {
  const IsLoggedIn = useSelector((state) => state.auth.IsLoggedIn)
  const theme = useSelector((state) => state.theme.mode)
  const userData = useSelector((state) => state.auth.userData)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  let headerClassName = 'bg-gray-100';
  let liClassName = 'inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full';
  let iconClassName = 'material-symbols-outlined py-7';
  if (theme === 'dark') {
    headerClassName += ' dark:bg-gray-950';
    liClassName += ' dark:text-white' // Add the dark mode class if the theme is dark
    iconClassName += ' text-white'
  }
  const handleclick = () => {
    dispatch(toggleTheme('light'))
  }
  const handlelight = () => {
    dispatch(toggleTheme('dark'))
  }
  const navItems = [
    {
      name: 'Home',
      slug: "/",
      active: true
    },
    {
      name: "Login",
      slug: "/login",
      active: !IsLoggedIn,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !IsLoggedIn,
    },
    {
      name: "My Posts",
      slug: "/My-Posts",
      active: IsLoggedIn,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: IsLoggedIn,
    },
    {
      name: "Profile",
      slug: `/profile/${userData?.username}/${userData?._id}`,
      active: IsLoggedIn,
    },
  ]


  return (
    <header className={headerClassName}>
      <Container>
        <nav className='flex'>
          <div className='mr-4 py-7'>
            <Link to='/'>
              <Logo width='100px' />

            </Link>
          </div>
          <ul className='flex ml-auto'>
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name} className='py-7'>
                  <button
                    onClick={() => navigate(item.slug)}
                    className={liClassName}
                  >{item.name}</button>
                </li>
              ) : null
            )}
            {IsLoggedIn && (
              <li className='py-7'>
                <LogoutBtn />
              </li>
            )}
            {
              theme === 'dark' && (
                <button className={iconClassName} onClick={handlelight}>
                  light_mode
                </button>
              )
            }
            {
              theme === 'light' && (
                <button className={iconClassName} onClick={handleclick}>
                  dark_mode
                </button>
              )
            }
          </ul>
        </nav>
      </Container>
    </header>
  )
}

export default Header
