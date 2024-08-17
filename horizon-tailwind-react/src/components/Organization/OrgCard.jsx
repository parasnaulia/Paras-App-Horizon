import React, { useState } from 'react';
import { FaAnglesDown } from "react-icons/fa6";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdDelete } from "react-icons/md";

const OrgCard = ({data,setAtt1}) => {
   const [tog,setTog]= useState(false);

  
    console.log("This is Data")
    console.log(data)
    const deletePAckage=()=>{
      
            const deletingData=async()=>{
                try{
                    const data1= await fetch("http://localhost:8000/api/organization",{
                        method:"DELETE",
                        headers:{
                            "Content-Type":"application/json"
                        },
                        body:JSON.stringify({name:data.Organization_Name})
                    })
                    const dataJson=await data1.json();
                    console.log(dataJson);
                    console.log("Api is Hitted");
                    // window.location.reload();
                    setAtt1();

                }

                catch(e)
                {
                    console.log("there is error in delete Package"+e);
                }
                
            
        }
        deletingData();

        }



  return (
    <div className='mt-5 flex flex-col justify-center items-center border-4 p-4 w-[50vw] gap-4 text-xl font-bold'>
        <div className='flex justify-between items-center w-[100%]'>
            <div>{data.Organization_Name}</div>
            <div className='flex justify-between items-center gap-2 text-navy-500 text-4xl'>
                <div className='cursor-pointer'><IoMdAddCircleOutline onClick={()=>{
                    alert("Hello")
                }} /></div>
                <div  className='cursor-pointer'><MdDelete onClick={deletePAckage}/></div>
            </div>
            
        </div>
        <div className='text-navy-500 text-lg cursor-pointer flex gap-2 items-center justify-center' onClick={()=>{setTog(!tog)}}>
            <div>Show Details</div>
            <div><FaAnglesDown/></div>
            
         </div>
     




        {tog===true&&<div className=' flex flex-col border-4 w-[70%] gap-3 p-3'  >
            <div className='flex justify-between items-center  w-[100%]  '>


            <div  className='text-bold mr-2'>Company_Email</div>
            <div className='font-light'> {data.Company_Email}</div>
            </div>
            
           <div className='flex justify-between items-center font-light'>
           <div className='flex justify-between items-center w-[100%]  '>


<div  className='font-bold mr-2'>Package</div>
<div className='font-light'> {data.Package}</div>
</div>
           </div>
           <div className='flex justify-between items-center  w-[100%]  '>


<div  className='text-bold mr-2'>Contact_Number</div>
<div className='font-light'> {data.Contact_Number}</div>
</div>
          
        </div>}

      
    </div>
  )
}

export default OrgCard
