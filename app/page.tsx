'use client'
import { useAuth } from "@/lib/AuthContext";
import login from "@/lib/login";
import { getAddress, verifyWallet } from "@/lib/wallet";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const { setIsAuthenticated, setJwtToken, setData } = useAuth();
  const router = useRouter();

  const postLogin = (auth: string, data : any) => {
    setData(data)
    setIsAuthenticated(true);
    setJwtToken(auth);
    router.push('/dashboard/business', { scroll: false })    
  }
  const checkUserExists = async (address: string) => {
    const response = await fetch("/api/user/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address: address,
      }),
    });
    const data = await response.json();
    console.log(data);
    return data.success;
  }

  const handleSignIn = async () => {
    verifyWallet().then(res => {
      console.log(res)
      if(!res || res.length == 0){
        alert("Please install or login to Tronlink to proceed.");
        return;
      }
      if(res.code != 200){
        alert(res.message);
        return;
      }
      getAddress().then(address => {
        checkUserExists(address).then(userExists => {
          if(userExists){
            login(postLogin)
          } else {
            router.push('/onboarding/business', { scroll: false })
          }
        })
      })
    }).catch(error => {
      console.log(error);
    })
    
    
  }
  return (
    <main>
      <div className="App">
        <div>

        <section className="hero text-center d-none" style={{
        background: 'linear-gradient(rgba(76, 175, 80, 0.8), rgba(76, 175, 80, 0.8)), url("https://picsum.photos/1200/400?random=1")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#ffffff',
        padding: '100px 0'
      }}>
        <div className="container">
          <h1 className="display-4 mb-4">Welcome to MintDeals</h1>
          <h4>Empowering Collective Financial Growth for Everyone</h4>
          <p className="lead mb-5">MintDeals is a decentralized platform where members, businesses, and partners come together to maximize savings and earn rewards through collective purchasing power. Whether you are here to find deals, grow your business, or connect communities, MintDeals has something for you.</p>
          <button id="ctaOnboardButton" className="btn btn-kmint-orange btn-lg mx-2" onClick={handleSignIn}>
              Boost your Business!
          </button>
          <button id="ctaExploreButton" className="btn btn-kmint-blue btn-lg mx-2">
            <Link href="/explore" className="nav-link">
              Explore Clubs
            </Link>
          </button>
        </div>
      </section>

      {/* Hero Section */}
      <section className="hero py-5 py-md-7">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-5 mb-md-0">
              <h1 className="display-4 fw-bold text-dark-green mb-4 mt-5">
                Supercharge Your Business with MintDeals
              </h1>
              <p className="lead mb-4">
                Join 50+ businesses revolutionizing their growth. Create clubs, unlock exclusive deals, and access smart credit - all powered by blockchain.
              </p>
              <div className="d-grid gap-2 d-md-flex justify-content-md-start">
              <button id="ctaExploreButton" className="btn btn-mint btn-lg px-4 me-md-2">
                <Link href="/explore" className="nav-link">Discover Clubs Near You</Link>
              </button>
                
                <button id="ctaOnboardButton" className="btn btn-outline-dark btn-lg px-4" onClick={handleSignIn}>
                  Start Your Own Club Today
                </button>
              </div>
            </div>
            <div className="col-md-6">
              <Image src="/images/hero-image.jpg"
               alt="MintDeals platform illustration" 
               height={500}
               width={300}
               className="img-fluid  d-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-5 bg-white">
        <div className="container text-center">
          <p className="lead mb-4">Trusted by over 50 local business communities</p>
          <div className="row justify-content-center align-items-center">
            {['logo1.png', 'logo2.png', 'logo3.png', 'logo4.png'].map((logo, index) => (
              <div key={index} className="col-6 col-md-3 mb-3 mb-md-0">
                <Image src={`/images/${logo}`} alt={`Trusted company ${index + 1}`} className="img-fluid" height={40} width={80} style={{filter: 'grayscale(100%) opacity(70%)'}} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-5 py-md-7">
        <div className="container">
          <h2 className="text-center mb-5">Why Choose MintDeals</h2>
          <div className="row g-4">
            {[
              { icon: "fas fa-heart", title: "10x Customer Loyalty", description: "Engage customers with irresistible, exclusive deals" },
              { icon: "fas fa-money-bill-wave", title: "Boost Cash Flow", description: "Access blockchain-powered credit to fuel your growth" },
              { icon: "fas fa-chart-line", title: "Build Business Credit", description: "Unlock more opportunities with an improved credit score" },
              { icon: "fas fa-lock", title: "Bank-Grade Security", description: "Powered by Tron blockchain for unmatched protection" }
            ].map((item, index) => (
              <div key={index} className="col-md-6 col-lg-3">
                <div className="card h-100 text-center">
                  <div className="card-body">
                    <i className={`${item.icon} text-mint fa-3x mb-3`}></i>
                    <h3 className="h5 card-title">{item.title}</h3>
                    <p className="card-text">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-5 py-md-7 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">Get Started in 4 Simple Steps</h2>
          <div className="row">
            {[
              { step: "1", title: "Create Your Club", description: "Set up in minutes and invite your community" },
              { step: "2", title: "Offer Exclusive Deals", description: "Attract customers with irresistible offers" },
              { step: "3", title: "Build Your Credit", description: "Watch your business credit score improve" },
              { step: "4", title: "Grow Your Business", description: "Access credit and expand your operations" }
            ].map((item, index) => (
              <div key={index} className="col-md-6 col-lg-3 mb-4 mb-lg-0">
                <div className="text-center">
                  <div className="rounded-circle bg-mint text-white d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: '64px', height: '64px'}}>
                    <span className="h4 mb-0">{item.step}</span>
                  </div>
                  <h3 className="h5 mb-2">{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About MintDeals */}
      <section className="bg-mint section-padding">
        <div className="container">
          <h2 className="text-center mb-4">Built on Trust and Innovation</h2>
          <p className="lead mb-4">MintDeals is revolutionizing business finance and customer loyalty through the power of blockchain technology. Built on the Tron network, we offer a secure, transparent, and efficient platform for businesses to access credit and engage with their customers like never before.</p>
          <div className="text-center">
            <Link target="_blank" href="https://paracosmlabs.gitbook.io/mintdeals" className="btn btn-dark">Learn More About MintDeals</Link>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-5 py-md-7 bg-light d-none">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <Image src="/images/quote.svg" alt="Quote" className="mb-4 d-none" width={48} height={48} />
              <blockquote className="blockquote mb-4">
                <p className="mb-0 font-italic">&quot;MintDeals transformed how we engage with our customers. Our loyalty program participation increased by 200%, and we&apos;ve seen a 30% boost in repeat business.&quot;</p>
              </blockquote>
              <figcaption className="blockquote-footer">
                Sarah Johnson, <cite title="Source Title" />Owner of Blossom Cafe
              </figcaption>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5 py-md-7 bg-mint">
        <div className="container text-center">
          <h2 className="mb-4">Ready to Transform Your Business?</h2>
          <p className="lead mb-4">Join the growing number of businesses already thriving with MintDeals</p>
          <button  onClick={handleSignIn} className="btn btn-outline-dark btn-lg">Start Your Own Club Today</button>
        </div>
      </section>


        </div>
      </div>
    </main>
  );
}
