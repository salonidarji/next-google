"use client";

import { signOut } from 'next-auth/react'

export default function List() {
    const handleClick = () => {
        signOut()
       }
    return (
        <div>Search
            <button onClick={handleClick} >Sign Out</button>
        </div>
        
   )
 }