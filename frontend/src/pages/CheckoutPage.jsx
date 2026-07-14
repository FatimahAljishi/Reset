import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
  const { customerPhone } = useCart();

  const fullPhoneNumber = customerPhone ? `${customerPhone}` : "";

  return (
    <main>
      <h1>Checkout</h1>

      <p>Phone number: {fullPhoneNumber}</p>
    </main>
  );
}
