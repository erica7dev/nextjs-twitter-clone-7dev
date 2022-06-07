import { CalendarIcon, EmojiHappyIcon, LocationMarkerIcon, PhotographIcon, SearchCircleIcon } from '@heroicons/react/outline'
import React, { useState, useRef } from 'react'
import { useSession } from 'next-auth/react';
import { TweetBody, Tweet } from '../typings';
import { fetchTweets } from '../utils/fetchTweets';
import toast from 'react-hot-toast';

interface Props {
  setTweets: Dispatch<SetStateAction<Tweet[]>>
}

function TweetBox({ setTweets }: Props) {
  const [image, setImage] = useState<string>('')
  const [input, setInput] = useState<string>('')

  const imageInputRef = useRef<HTMLInputElement>(null)

  const { data: session } = useSession()
  const [imageUrlBoxIsOpen, setImageUrlBoxIsOpen] = useState<boolean>(false)

  const addImageToTweet = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (!imageInputRef.current?.value) return;

    setImage(imageInputRef.current.value)
    imageInputRef.current.value = ''
    setImageUrlBoxIsOpen(false)
  }

  const postTweet = async () => {
    const tweetInfo: TweetBody = {
      text: input,
      username: session?.user?.name || 'Unknown User',
      profileImg: session?.user?.image || '',
      image: image
    }

    const result = await fetch(`/api/addTweet`, {
      body: JSON.stringify(tweetInfo),
      method: 'POST',
    })

    const json = await result.json();

    const newTweets = await fetchTweets();
    setTweets(newTweets)

    toast('Tweet Posted', {
      icon: ''
    })
    return json
  }

  const handleSubmit = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    e.preventDefault()

    postTweet()

    setInput('')
    setImage('')
    setImageUrlBoxIsOpen(false)
  }

  return (
    <div className="flex space-x-2 p-5">
      <img
        className='mt-4 h-14 w-14 rounded-full object-cover'
        src={session?.user?.image || "https://pbs.twimg.com/profile_images/1471938408431951877/BHh_2AGK_400x400.jpg"}
        alt="" />

      <div className='flex flex-1 items-center pl-2'>
        <form className='flex flex-1 flex-col'>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            className='h-24 w-full text-xl outline-none placeholder:text-xl'
            type="text"
            placeholder="What\'s Happening"
          />
          <div className='flex items-center'>
            <div className='flex flex-1 space-x-2 text-twitter'>
              <PhotographIcon
                onClick={() => setImageUrlBoxIsOpen(!imageUrlBoxIsOpen)}
                className='h-5 w-5 cursor-pointer transition-transform duration-150 ease-out hover:scale-150' />
              <SearchCircleIcon className='h-5 w-5' />
              <EmojiHappyIcon className='h-5 w-5' />
              <CalendarIcon className='h-5 w-5' />
              <LocationMarkerIcon className='h-5 w-5' />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!input || !session}
              className='disabled:opacity-60 bg-twitter px-5 py-2 font-bold text-white rounded-full'>Tweet</button>
          </div>

          {imageUrlBoxIsOpen && (
            <form className="rounded-lg mt-5 flex bg-twitter/80 py-2 px-4">
              <input
                ref={imageInputRef}
                className="flex-1 bg-transparent p-2 text-white outline-none placeholder:text-white"
                type="text"
                placeholder="Enter Image URL..."
              />
              <button
                type="submit"
                onClick={e => addImageToTweet}
                className="font-bold text-white">Add Image</button>
            </form>
          )}
          {image && (
            <img
              src={image}
              className="mt-10 h-40 w-full rounded-xl object-contain shadow-lg"
              alt=""
            />
          )}
        </form>
      </div>
    </div>
  )
}

export default TweetBox
