import Navbar from '../components/home/Navbar'
import Hero from '../components/home/Hero'
import TickerStrip from '../components/home/TickerStrip'
import TrustBar from '../components/home/TrustBar'
import FeaturesGrid from '../components/home/FeaturesGrid'
import SolutionsGrid from '../components/home/SolutionsGrid'
import WalletPromo from '../components/home/WalletPromo'
import WhyMotivoLogs from '../components/home/WhyMotivoLogs'
import ProcessSteps from '../components/home/ProcessSteps'
import ServicesMarketplace from '../components/home/ServicesMarketplace'
import CtaBanner from '../components/home/CtaBanner'
import Footer from '../components/home/Footer'
import BackToTop from '../components/home/BackToTop'

// Sections render top-to-bottom in this order — to rearrange the page, just
// move the lines below.
const Home = ({ isLoggedIn }) => {
  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} />
      <Hero />
      <TickerStrip />
      <TrustBar />
      <FeaturesGrid />
      <ServicesMarketplace />
      <SolutionsGrid />
      <WalletPromo />
      <WhyMotivoLogs />
      {/* <ProcessSteps /> */}
      <CtaBanner />
      <Footer />
      <BackToTop />
    </div>
  )
}

export default Home
