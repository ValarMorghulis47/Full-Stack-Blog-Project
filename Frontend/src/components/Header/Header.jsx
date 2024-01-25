import React from 'react'
import { Container, Logo, LogoutBtn } from '../index'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Header() {
  const IsLoggedIn = useSelector((state) => state.auth.IsLoggedIn)
  const navigate = useNavigate()

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
  ]


  return (
    <header className='bg-gray-100'>
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
                    className='inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
                  >{item.name}</button>
                </li>
              ) : null
            )}
            {IsLoggedIn && (
              <li className='py-7'>
                <LogoutBtn />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  )
}

export default Header
