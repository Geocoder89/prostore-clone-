'use client'
import { useRouter } from "next/navigation"
import { toast, useToast } from "@/hooks/use-toast"
import { useTransition } from "react"
import { PaymentMethodSchema } from "@/lib/validators"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/lib/constants"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { PaymentMethod } from "@/types"
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { updateUserPaymentMethod } from "@/lib/actions/user-actions"
interface PaymentMethodFormProps{
  preferredPaymentMethod: string | null
}

const PaymentMethodForm:React.FC<PaymentMethodFormProps> = ({preferredPaymentMethod})=> {
  const router = useRouter()
  const {} = useToast()
  const form = useForm<z.infer<typeof PaymentMethodSchema>>({
    resolver: zodResolver(PaymentMethodSchema),
    defaultValues: {
      type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD
    }
  })

  const [isPending, startTransition ] = useTransition()

  const onSubmit = async (values: PaymentMethod)=>{
    startTransition(async ()=>{
      const res = await updateUserPaymentMethod(values)

      if(!res.success) {
        toast({
          variant: 'destructive',
          description: res.message
        })
        return
      }

      router.push('/place-order')

    })
  }

  return (
  
    <>
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="h2-bold mt-4">
        Payment Method
      </h1>
      <p className="text-sm text-muted-foreground">
        Please select a payment method
      </p>
      <Form {...form}>
        <form method="post" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col md:flex-row gap-5">
           <FormField
           control={form.control}
           name="type"
           render={({field})=>(
            <FormItem className="space-y-3">
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} className="flex flex-col space-y-2">
                    {PAYMENT_METHODS.map((method)=> 
                    <FormItem key={method} className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={method} checked={field.value === method}/>
                      </FormControl>
                      <FormLabel className="font-normal">
                        {method}
                      </FormLabel>
                    </FormItem>
                    )}
                  </RadioGroup>
                </FormControl>
                <FormMessage/>
              </FormItem>
           )}
           />
          </div>
  
  
  
          <div className="flex gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? (<Loader className="w-4 h-4 animate-spin"/>) : <ArrowRight className="h-4 w-4"/>} Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
    </>
)
}

export default PaymentMethodForm