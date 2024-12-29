
import { getLatestProducts } from "@/lib/actions/product-actions";
import ProductList from "@/components/shared/product/product-list";
const HomePage = async () => {

  const latestProducts = await getLatestProducts()
  // await delay(2000)
  return ( <>
  <ProductList data={latestProducts} title="newest arrivals"/>
  </> );
}
 
export default HomePage;