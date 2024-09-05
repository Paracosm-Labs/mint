'use client'
import { useAuth } from "@/lib/AuthContext";
import login from "@/lib/login";
import { getAddress, verifyWallet } from "@/lib/wallet";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const { setIsAuthenticated, setJwtToken } = useAuth();
  const router = useRouter();

  const postLogin = (auth: string) => {
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
        </div>
      </div>
    </main>
  );
}
