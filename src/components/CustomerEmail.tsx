import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import emailjs from '@emailjs/browser'

interface CustomerEmailProps {
  packageDetail: string
}

const emailSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
})

type EmailFormValues = z.infer<typeof emailSchema>

const CustomerEmail: React.FC<CustomerEmailProps> = ({ packageDetail }) => {
  const [successMessage, setSuccessMessage] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
  })

  const onSubmit = async (data: EmailFormValues) => {
    try {
      console.log(
        process.env.NEXT_PUBLIC_SERVICEID,
        process.env.NEXT_PUBLIC_TEMPLATEID, 
        process.env.NEXT_PUBLIC_PUBLICKEY
      );
      
      const templateParams = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone_number: data.phoneNumber,
        tier: packageDetail,
      }

      const response = await emailjs.send(
        `${process.env.NEXT_PUBLIC_SERVICEID}`,
        `${process.env.NEXT_PUBLIC_TEMPLATEID}` ,
        templateParams,
        `${process.env.NEXT_PUBLIC_PUBLICKEY}`
      )
console.log(response);

      if (response.status === 200) {
        setSuccessMessage('You will receive an email shortly.')
        reset()
      }
    } catch (error) {
      console.error('Error submitting email:', error)
      setSuccessMessage('Failed to send email. Please try again.')
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6">
      {packageDetail}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <input
            {...register('firstName')}
            type="text"
            id="firstName"
            placeholder="Enter your first name"
            className="w-full px-3 text-black py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.firstName && (
            <p className="text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <input
            {...register('lastName')}
            type="text"
            id="lastName"
            placeholder="Enter your last name"
            className="w-full px-3 text-black py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.lastName && (
            <p className="text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            placeholder="Enter your email"
            className="w-full px-3 text-black py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <input
            {...register('phoneNumber')}
            type="tel"
            id="phoneNumber"
            placeholder="Enter your phone number"
            className="w-full px-3 text-black py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.phoneNumber && (
            <p className="text-sm text-red-600">{errors.phoneNumber.message}</p>
          )}
        </div>

        {successMessage && (
          <p className="text-sm text-green-600 text-center">{successMessage}</p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center bg-custompink text-white py-2 px-4 rounded-md shadow-sm hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isSubmitting ? 'Sending...' : 'Send'}
        </Button>
      </form>
    </div>
  )
}

export default CustomerEmail