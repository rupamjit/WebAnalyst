"use client"
import DashBoardComponent from '@/components/DashBoardComponent'
import Navbar from '@/components/Navbar'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Website } from '@/types/website'

const page = () => {
 const [websites, setWebsites] = useState<Website[]>([])
 const [loading, setLoading] = useState(true)
 
 const getWebsites = async ()=>{
   try {
     const result = await axios.get("/api/website")
     setWebsites(result?.data || [])
     console.log(result?.data)
   } catch (error) {
     console.error("Failed to fetch websites:", error)
   } finally {
     setLoading(false)
   }
 }

 useEffect(()=>{
   getWebsites()
 },[])
 
  return (
    <div>
        <DashBoardComponent 
          websites={websites} 
          loading={loading}
          onRefetch={getWebsites}
        />
    </div>
  )
}

export default page