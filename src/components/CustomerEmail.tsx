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
  email: z.string().email('Invalid email address'),
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
      const templateParams = {
        email: data.email,
        title: packageDetail,
      }

      const response = await emailjs.send(
        'service_89bzej1', // Replace with your EmailJS service ID
        'template_tzjanam', // Replace with your EmailJS template ID
        templateParams,
        'axieVSSsGN1bDnjRn' // Replace with your EmailJS public key
      )
console.log(response);

      if (response.status === 200) {
        setSuccessMessage('Email sent successfully!')
        reset()
      }
    } catch (error) {
      console.error('Error submitting email:', error)
      setSuccessMessage('Failed to send email. Please try again.')
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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