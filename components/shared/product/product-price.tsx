
import { cn } from "@/lib/utils";
interface ProductPriceProps {
  value: number;
  className?: string;
}

const ProductPrice:React.FC<ProductPriceProps> = ({value,className}) => {
  // ensure 2 decimal places
  const stringValue = value.toFixed(2)

  // Get the int and float

  const [intVal,FloatVal] = stringValue.split('.')
  return ( 
    <p className={cn('text-2xl',className)}>
      <span className="text-xs align-super">
        $
      </span>
        {intVal}
      <span className="text-xs align-super">
      {FloatVal}
</span>
    </p>
   );
}
 
export default ProductPrice;