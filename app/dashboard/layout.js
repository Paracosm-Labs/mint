import Sidebar from "../components/sidebar";


export default function DashboardLayout({
    children, // will be a page or nested layout
  }) {
    return (
        <div className="kmint container-fluid">
            <div className="row">
                <Sidebar />
                {children}
                <div className='col-md-3'></div>
            </div>
        </div>
    )
  }