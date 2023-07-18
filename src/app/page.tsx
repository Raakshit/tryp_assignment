import Navbar from '@/Components/Navbar'
import DataTables from '@/Components/DataTables'

export default function Home() {

  const headers = ["Timestamp","PurchaseId","Mail","Name","Source","Status","SELECT"];


  return (
    <main >
      <Navbar/>
      <DataTables
      caption="Booking"
      headers={headers}
      />
    </main>
  )
} 
