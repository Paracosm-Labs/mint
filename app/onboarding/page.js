'use client'
import Link from 'next/link'
import React from 'react'
import { Button, Card } from 'react-bootstrap'

const Onboarding = () => {
  return (
    <div className="container">
      <div className="container choice-container">
        <h1 className="text-center text-white mt-3 mb-5">Get Started</h1>
        <div className="row">
          <div className="col-md-3 mb-4">
            {/* <Card className="h-100 onboard-choice">
              <Card.Img 
                variant="top" 
                src="https://plus.unsplash.com/premium_photo-1661281342050-4d340ca8f3d5?q=80&w=2070&auhref=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Person working on a laptop in a cafe, representing a small business owner"
              />
              <Card.Body className="text-center">
                <Card.Title as="h2" className="mb-3">Member</Card.Title>
                <ul className="onboard list-unstyled text-start mb-5">
                    <li><i className="fa fa-circle-check text-success me-2"></i>Explore and join exclusive clubs</li>
                    <li><i className="fa fa-circle-check text-success me-2"></i>Access exclusive deals</li>
                    <li><i className="fa fa-circle-check text-success me-2"></i>Support local businesses</li>
                </ul>

                <Button size="lg" className="btn btn-kmint-blue mt-2">
                  <Link href="/explore" className="nav-link">
                    Connect Wallet<br/>

                  </Link>
                </Button>
              </Card.Body>
            </Card> */}
          </div>

          {/* <div className="col-md-4 mb-4">
            <Card className="h-100 onboard-choice">
              <Card.Img 
                variant="top" 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auhref=format&fit=crop&w=1470&q=80" 
                alt="Two people shaking hands, representing partnership"
              />
              <Card.Body className="text-center">
                <Card.Title as="h2" className="mb-3">Partner</Card.Title>
                <ul className="onboard list-unstyled text-start mb-3">
                  <li><i className="fa fa-circle-check text-success me-2"></i>Earn commissions</li>
                  <li><i className="fa fa-circle-check text-success me-2"></i>Flexible promotion options</li>
                  <li><i className="fa fa-circle-check text-success me-2"></i>Join up to 5 clubs for free</li>
                </ul>

                <ul className="list-unstyled text-start mb-3">
                    <li className='text-muted'>
                        <i className="fa fa-id-card me-2"></i>
                        Dominica DID Required
                    </li>
                </ul>

                <Button size="lg" className="btn btn-kmint-blue">
                  <Link href="/onboarding/partner" className="nav-link ">
                    <span className='text-decoration-line-through text-muted text-white'>$20 One Time Payment</span><br/>
                    Free For Limited Time
                  </Link>
                </Button>
              </Card.Body>
            </Card>
          </div> */}

          <div className="col-md-6 mb-4">
            <Card className="h-100 onboard-choice">
              <Card.Img 
                variant="top" 
                src="https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auhref=format&fit=crop&w=1470&q=80" 
                alt="Person working on a laptop in a cafe, representing a small business owner"
              />
              <Card.Body className="text-center">
                <Card.Title as="h2" className="mb-3">Business</Card.Title>

                <ul className="onboard list-unstyled text-start mb-3">
                <li>
                        <i className="fa fa-circle-check text-success me-2"></i>
                        Create multiple clubs
                    </li>
                    <li>
                        <i className="fa fa-circle-check text-success me-2"></i>
                        Manage your exclusive deals
                    </li>
                  <li><i className="fa fa-circle-check text-success me-2"></i>Access shared credit facility</li>
                  <li><i className="fa fa-circle-check text-success me-2"></i>Increase customer loyalty</li>
                  <li><i className="fa fa-circle-check text-success me-2"></i>Boost your local presence</li>
                </ul>

                <ul className="list-unstyled text-start mb-3">
                    <li className='text-muted'>
                        <i className="fa fa-id-card me-2"></i>
                        Dominica DID Required
                    </li>
                </ul>

                <Button size="lg" className="btn btn-kmint-blue">
                  <Link href="/onboarding/business" className="nav-link">
                  <span className='text-decoration-line-through text-muted text-white'>$60 One Time Payment</span><br/>
                    Free For Limited Time
                  </Link>
                </Button>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Onboarding
