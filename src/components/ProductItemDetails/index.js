import {Component} from 'react'
import {withRouter} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    productDetails: [],
    similarProducts: [],
    productCount: 1,
  }

  componentDidMount = () => {
    this.getProductDetails()
  }

  convertFetchedDataToUpdatedData = data => ({
    id: data.id,
    availability: data.availability,
    brand: data.brand,
    imageUrl: data.image_url,
    rating: data.rating,
    price: data.price,
    title: data.title,
    style: data.style,
    totalReviews: data.total_reviews,
    description: data.description,
  })

  getProductDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')

    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()

    if (response.ok) {
      const updatedProductDetails = this.convertFetchedDataToUpdatedData(data)

      const updatedSimilarProducts = data.similar_products.map(eachProduct =>
        this.convertFetchedDataToUpdatedData(eachProduct),
      )

      this.setState({
        apiStatus: apiStatusConstants.success,
        productDetails: updatedProductDetails,
        similarProducts: updatedSimilarProducts,
      })
    } else if (response.status === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onIncreaseProductCount = () => {
    this.setState(prevState => ({productCount: prevState.productCount + 1}))
  }

  onDecreaseProductCount = () => {
    const {productCount} = this.state
    if (productCount > 1) {
      this.setState(prevState => ({productCount: prevState.productCount - 1}))
    }
  }

  onClickContinueShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderingProductsView = () => {
    const {productDetails, similarProducts, productCount} = this.state
    const {
      imageUrl,
      title,
      price,
      rating,
      totalReviews,
      description,
      availability,
      brand,
    } = productDetails
    return (
      <div className="products-item-details-section">
        <div className="product-item-container">
          <img src={imageUrl} alt="product" className="product-image" />

          <div className="product-details-text-container">
            <h1 className="product-title">{title}</h1>
            <p className="product-price">RS {price}/-</p>
            <div className="product-rating-container">
              <div className="rating-container">
                <p>{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-img"
                />
              </div>

              <p className="product-review">{totalReviews} Reviews</p>
            </div>
            <p className="product-description">{description}</p>

            <div className="product-availability-container">
              <p className="product-availability-label"> Available: </p>
              <p className="availability">{availability}</p>
            </div>
            <div className="product-brand-container">
              <p className="product-brand-label"> Brand: </p>
              <p className="brand-status">{brand}</p>
            </div>
            <hr className="hr-line" />
            <div className="buttons-controller">
              <button
                type="button"
                data-testid="minus"
                className="btn-control"
                onClick={this.onDecreaseProductCount}
              >
                <BsDashSquare className="plus-minus-icon" />
              </button>

              <p className="product-count">{productCount}</p>
              <button
                type="button"
                data-testid="plus"
                className="btn-control"
                onClick={this.onIncreaseProductCount}
              >
                {' '}
                <BsPlusSquare className="plus-minus-icon" />{' '}
              </button>
            </div>
            <button type="button" className="product-add-to-cart">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="similar-products-section-container">
          <h1 className="similar-products-heading">Similar Products</h1>
          <ul className="similar-products-list">
            {similarProducts.map(product => (
              <SimilarProductItem itemDetails={product} key={product.id} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderingFailureView = () => (
    <div className="product-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="product-failure-view-img"
      />
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <button
        type="button"
        className="continue-shopping-btn"
        onClick={this.onClickContinueShopping}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderingViews = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderingFailureView()
      case apiStatusConstants.success:
        return this.renderingProductsView()

      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        {this.renderingViews()}
      </div>
    )
  }
}

export default withRouter(ProductItemDetails)
