import React from 'react'

import SidebarRow from './SidebarRow'
import { useSession, signIn, signOut } from 'next-auth/react';

import {
  BellIcon,
  HashtagIcon,
  BookmarkIcon,
  CollectionIcon,
  MailIcon,
  HomeIcon,
  UserIcon,
  DotsCircleHorizontalIcon
} from '@heroicons/react/outline'

function Sidebar() {
  const { data: session } = useSession()

  return (
    <div className='col-span-2 flex flex-col items-center px-4 md:items-start'>
      <img
        className='m-3 h-7 w-10'
        src={ session?.user?.image || "https://upload.wikimedia.org/wikipedia/pt/thumb/3/3d/Twitter_logo_2012.svg/1267px-Twitter_logo_2012.svg.png" }
      />
      <SidebarRow Icon={HomeIcon} title="Home" />
      <SidebarRow Icon={HashtagIcon} title="Explorer" />
      <SidebarRow Icon={BellIcon} title="Notifications" />
      <SidebarRow Icon={MailIcon} title="Messages" />
      <SidebarRow Icon={BookmarkIcon} title="Bookmarks" />
      <SidebarRow Icon={CollectionIcon} title="Lists" />
      <SidebarRow onClick={session ? signOut : signIn} Icon={UserIcon} title={session ? 'Sign Out':'Sign In'} />
      <SidebarRow Icon={DotsCircleHorizontalIcon} title="More" />
    </div>
  )
}
export default Sidebar