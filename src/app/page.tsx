"use client";

import Image from 'next/image'
import styles from './page.module.css'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react"
import List from './list/page';

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession()
  
  const handleClick = () => {
   signIn("google")
  }
  return (
    <main className={styles.main}>
      {status === "authenticated" ? (<List />) : (<button
        onClick={handleClick}
      >
        
        Continue with Google
      </button>)}
    </main>
  )
}
