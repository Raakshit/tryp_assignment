import Navbar from '@/Components/Navbar'
import DataTables from '@/Components/DataTables'

export default function Home() {

  const headers = ["TIMESTAMP","PRUCHASE ID","MAIL","NAME","SOURCE","STATUS","SELECT"];


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
