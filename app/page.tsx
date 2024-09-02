
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div className="App">
        <div>
        <section className="hero text-center" style={{
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
          {/* <button id="ctaOnboardButton" className="btn btn-kmint-orange btn-lg mx-2">
            <Link href="/onboarding" className="nav-link">
              Get Started
            </Link>
          </button> */}
          <button id="ctaExploreButton" className="btn btn-kmint-blue btn-lg mx-2">
            <Link href="/explore" className="nav-link">
              Explore Clubs
            </Link>
          </button>
        </div>
      </section>
        </div>
      </div>
    </main>
  );
}
