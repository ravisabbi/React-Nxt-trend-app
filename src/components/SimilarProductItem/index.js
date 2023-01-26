import './index.css'

const SimilarProductItem = props => {
  const {itemDetails} = props
  const {imageUrl, title, brand, price, rating} = itemDetails
  return (
    <li className="similar-product-item">
      <img
        src={imageUrl}
        alt="similar product"
        className="similar-products-img"
      />
      <h1 className="similar-product-title">{title}</h1>
      <p className="similar-product-brand">by {brand}</p>
      <div className="similar-product-price-rating-btn">
        <p className="similar-product-price">RS {price}/-</p>
        <button type="button" className="similar-product-rating-btn">
          <p>{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="str"
            className="similar-product-rating-star-img"
          />
        </button>
      </div>
    </li>
  )
}

export default SimilarProductItem
