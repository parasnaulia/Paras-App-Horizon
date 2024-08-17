import React, { useEffect, useState } from 'react'
import { IoIosArrowBack } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import Inputbox from '../../layouts/auth/Inputbox';
import Cookies from 'js-cookie';
import { FaCheck } from "react-icons/fa";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setName } from 'Store/Slice2';
import { setEmail } from 'Store/Slice2';
import { setPassword } from 'Store/Slice2';
import { add } from 'Store/Slice1';
import { setRole } from 'Store/Slice2';
import { useLatestRef } from '@chakra-ui/hooks';


const Index = () => {
const navigate=  useNavigate();
const dispatch=useDispatch();
const [email,setEmail]=useState("");
const [password,setPassword]=useState("");
const [name,setName]=useState("");
const [error,setError]=useState(true);
const [myEmail,setMyEmail]=useState("")

const [pass,setPass]=useState("");
const [cpass,setCpass]=useState("");


const pass1=(e)=>{
    setPass(e.target.value)
}
const pass2=(e)=>{
    setCpass(e.target.value)
}





// const dispatch=useDispatch()
const updatePAssword=()=>{



  const updatingThePAssword=async()=>{
    try{

        const data=await fetch("http://localhost:8000/api/newpass",{
            method:"PATCH",
            
                headers:{
                      "Content-Type":"application/json"

                },
                body:JSON.stringify({name:myEmail,pass:{pass},cpass:{cpass}})
            
          
        })
        // console.log(object)
        const jsonData=await data.json();
        console.log(jsonData);
        console.log("The api is Hitted");
        navigate("/")

    }
    catch(e)
    {
        console.log("This is The Update PAssword Error "+ e);
    }

  }

  if(pass===cpass)
  {
    updatingThePAssword();

  }
  else
  {
    alert("Password is Not Matching")
  }
  
}
useEffect(()=>{
    const token = Cookies.get('jwt');
    console.log(token);
    if(token)
    {
     // console.log("token mil Gya bhai");
 
 
 
     const datfetcher=async()=>{
       const data=await fetch("http://localhost:8000/api/auth",{
         method:"POST",
         headers:{
           "Content-Type":"application/json"
         },
         body: JSON.stringify({token:token}),
       });
       const resdata=await data.json();
       console.log("this is use Effect")
       console.log(resdata.data.Name);
       console.log("Data is Accepted");
       setMyEmail(resdata.data.Email);
  
         // dispatch(setRole(resdata.data.Role));
 
       
 
     }
     datfetcher();
 
 
 
 
 
     console.log(token);
    }
    else
    {
     // console.log("NO Token")
 
     window.location.replace('/auth/sign-in');
 
    }
 
 
   // const dataFetch=async()=>{
 
     
 
   // }
   // dataFetch();
 
   
 
 },[]);



  return (
    <>    <div className='flex  justify-between p-0  m-0'>
        <div className='flex flex-col  pl-10 w-2/5'>
            <div className='mb-20  flex gap-2 justify-center items-center text-gray-400 text-sm'>
                <div>
                <IoIosArrowBack />
                    </div>
                    <div className='cursor-pointer' >
                    Back to dashboard

                    </div>
              
                    </div>
            <div className='mt-[10vh] w-full max-w-full flex-col items-center md:pl-8 lg:pl-0 xl:max-w-[420px] '>
            <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Create New Password
        </h4>

            </div>
            <div className='mt-2 text-gray-400' >Enter your email and password to sign in!</div>
            <div className='mt-6 flex justify-center items-center cursor-pointer  bg-gray-100 px-5 py-3 gap-2 rounded-md'>
                <div><FcGoogle /></div>
            <h5 className="text-sm font-medium text-navy-700 dark:text-white ">
            Sign In with Google
          </h5>
            </div>
            <div className="mb-5 flex items-center  gap-3 mt-3">
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
          <p className="text-base text-gray-600 dark:text-white"> or </p>
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
        </div>
            <div className='bg-gray-100 dark:text-white' >
           
            <Inputbox setData1={pass1}  type="text" place="Min .8 Characters" label="New_Password"/>
               <Inputbox setData1={pass2}   type="text" place="Min .8 Characters" label="Confirm_New_Password"/>
             
            </div>
            <div className='mt-2 flex justify-between p-1'>
                <div className={`flex gap-1 justify-center items-center cursor-pointer` }>
                  
                   

                </div>
                <div className='text-red-600'>{error}</div>
               

            </div>
            <div className='mt-4  cursor-pointer'>
                <div>
                  <button onClick={updatePAssword}  className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
                    Create Password
                    </button>
         
               </div>

                </div>
            
            
           
            
         
          <div className='flex justify-center items-center mt-8 text-gray-400'>
            <div>©2024 Horizon UI. All Rights Reserved.</div>
          </div>
                
            
        </div>
        
    <div className="flex justify-end items-center flex-col   mb-8 w-[60%]">
  <div className="flex-shrink-0 w-full h-full flex justify-end  ">
    <img src="../../../auth.png" className='w-[75%] h-[98vh] object-cover rounded-bl-[35%]' alt="Auth Image" />
  </div>
 

</div>

      
    </div>
   
    </>

  )
}

export default Index
