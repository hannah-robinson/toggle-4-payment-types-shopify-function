// @ts-check
// Use JSDoc annotations for type safety
/**
 * @typedef {import("../generated/api").InputQuery} InputQuery
 * @typedef {import("../generated/api").FunctionResult} FunctionResult
 * @typedef {import("../generated/api").HideOperation} HideOperation
 */
/**
 * @type {FunctionResult}
 */
const NO_CHANGES = {
  operations: [],
}

const PAYMENT_METHODS_TO_HIDE = []

// The @shopify/shopify_function package will use the default export as your function entrypoint
export default /**
 * @param {InputQuery} input
 * @returns {FunctionResult}
 */

(input) => {
  // Get the cart total from the function input
  const cartTotal = parseFloat(input.cart.cost.totalAmount.amount ?? '0.0')

  // Set up Buy Now Pay Later (BNPL) availability conditions
  let afterpay = true
  let laybuy = true
  let zip = true
  let klarna = true

  if (cartTotal < 100 || cartTotal > 150000) {
    afterpay = false
  }
  if (cartTotal < 12000 || cartTotal > 150000) {
    laybuy = false
  }
  if (cartTotal < 5000 || cartTotal > 150000) {
    zip = false
  }
  if (cartTotal < 100 || cartTotal > 200000) {
    klarna = false
  }

  if (cartTotal < 100) {
    // You can use STDERR for debug logs in your function
    console.error(
      'Cart total is not high enough, no need to hide the payment method.'
    )
    return NO_CHANGES
  }

  // Find the payment methods to hide
  const hideAfterpayPaymentMethod = input.paymentMethods.find((method) =>
    method.name.includes('Afterpay')
  )

  const hideLaybuyPaymentMethod = input.paymentMethods.find((method) =>
    method.name.includes('Laybuy')
  )

  const hideZipPaymentMethod = input.paymentMethods.find((method) =>
    method.name.includes('Zip')
  )

  const hideKlarnaPaymentMethod = input.paymentMethods.find((method) =>
    method.name.includes('Klarna')
  )

  if (hideAfterpayPaymentMethod) {
    PAYMENT_METHODS_TO_HIDE.push({
      hide: {
        paymentMethodId: hideAfterpayPaymentMethod.id,
      },
    })
  }

  if (hideLaybuyPaymentMethod) {
    PAYMENT_METHODS_TO_HIDE.push({
      hide: {
        paymentMethodId: hideLaybuyPaymentMethod.id,
      },
    })
  }

  if (hideZipPaymentMethod) {
    PAYMENT_METHODS_TO_HIDE.push({
      hide: {
        paymentMethodId: hideZipPaymentMethod.id,
      },
    })
  }

  if (hideKlarnaPaymentMethod) {
    PAYMENT_METHODS_TO_HIDE.push({
      hide: {
        paymentMethodId: hideKlarnaPaymentMethod.id,
      },
    })
  }

  // The @shopify/shopify_function package applies JSON.stringify() to your function result
  // and writes it to STDOUT
  return {
    operations: PAYMENT_METHODS_TO_HIDE,
  }
}
