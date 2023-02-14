import React, { useState, useEffect } from "react";
import { useLazyQuery, useMutation } from "react-apollo";
import UPDATE_CART from "../graphql/updateCart.graphql"
import GET_PRODUCT from "../graphql/getProductBySku.graphql"
import {useCssHandles} from "vtex.css-handles";
import "../styles.css"

const QuickOrder = () => {
  const CSS_HANDLES = ["contenedor_form", "div_h2", "input_text","input_submit"]
  const handles = useCssHandles(CSS_HANDLES)
  const [inputText, setInputText] = useState("");
  const [search, setSearch] = useState("")

  const [getProductData, { data: product }] = useLazyQuery(GET_PRODUCT)
  const [addToCart] = useMutation(UPDATE_CART)

  const handleChange = (e: any) => {
    setInputText(e.target.value)
    console.log("Input changed", inputText);
  }

  useEffect(() => {
    console.log("El resultado de mi producto es ", product, search)
    if (product) {
      let skuId = parseInt(inputText)
      console.log("Mis datos necesarios ", skuId, product)
      addToCart({
        variables: {
          salesChannel: "1",
          items: [
            {
              id: skuId,
              quantity: 1,
              seller: "1"
            }
          ]
        }
      })
        .then(() => {
          window.location.href = "/checkout"
        })
    }
  }, [product, search])

  const addProductToCart = () => {
    getProductData({
      variables: {
        sku: inputText
      }
    })
  }
  const searchproduct = (e: any) => {
    e.preventDefault();
    if (!inputText) {
      alert("Oiga, ingresa algo")
    } else {
      console.log("Al final estamos buscando", inputText)
      setSearch(inputText)
      addProductToCart()

    }
  }

  return <div>
    <h2 className={handles.div_h2}>Compra rapida Oportunidades</h2>
    <form className={handles.contenedor_form} onSubmit={searchproduct}>
    <h5 className={handles.div_h2}>Ingresa el Número de Sku</h5>
      <div>
        <input className={handles.input_text} id="sku" type="text" onChange={handleChange} />
      </div>
      <br/>
      <input className={handles.input_submit} type="submit" value="AGREGAR AL CARRITO" />
    </form>
  </div>
}

export default QuickOrder

