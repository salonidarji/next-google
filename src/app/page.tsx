"use client";

import Image from 'next/image'
import styles from './page.module.css'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react"
import Button from '@mui/material/Button/Button';
import List from './list/page';

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession()
  
  const handleClick = () => {
   signIn("google")
  }
  return (
    <main className={styles.main}>
      {status === "authenticated" ? (<List />) : (<Button variant ='contained' color='primary'
        onClick={handleClick}
      >
        Sign In with Google
      </Button>)}
    </main>
  )
}
