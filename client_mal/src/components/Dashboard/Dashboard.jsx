import SalesCard from "../charts/salesChart";
import TopOrdersCard from "../charts/TopOrdersCard";

function Dashboard() {
  return (
    <div className="dashborder ml-4">
      <div className="grid grid-cols-2 gap-4 w-2/3 mt-5"> {/* Utiliza la clase 'w-1/2' para limitar el ancho al 50% */}
        <div className="col-span-1 card1">
          <SalesCard />
        </div>
        <div className="col-span-1 card2" style={{ height: '100%' }}>
          <TopOrdersCard />
        </div>
      </div>
      <div className=" h-[285px] w-[828px] mt-4" >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4">

          <div className="bg-white rounded-lg shadow-md p-4 h-[130px] w-[100x] shadow-2xl">
            <h2 className="text-1 font-semibold text-gray-600">SALES</h2>

            <p className="text-4xl font-bold text-black-500 mt-2">$237,25</p>
            <h2 className="text-sm font-semibold text-black-600 mt-2">Sold Today</h2>
          </div>


          <div className="bg-white rounded-lg shadow-md p-4 border-red-500 h-[130px] w-[100x]">
            <h2 className="text-1 font-semibold text-gray-600">SALES</h2>

            <p className="text-4xl font-bold text-black-500 mt-2">$1725,23</p>
            <h2 className="text-sm font-semibold text-black-600 mt-2">Sold this week</h2>
          </div>


          <div className="bg-white rounded-lg shadow-md p-4 border-red-500 h-[130px] w-[100x]">
            <h2 className="text-1 font-semibold text-gray-600">REVIEWS</h2>

            <p className="text-4xl font-bold text-black-500 mt-2">4.9</p>
            <h2 className="text-sm font-semibold text-black-600 mt-2">Out of 5 max score</h2>
          </div>


          <div className="bg-white rounded-lg shadow-md p-4 border-red-500 h-[130px] w-[100x]">
            <h2 className="text-1 font-semibold text-gray-600">PRODUCTS</h2>

            <p className="text-4xl font-bold text-black-500 mt-2">138</p>
            <h2 className="text-sm font-semibold text-black-600 mt-2">Ready to sell</h2>
          </div>


          <div className="bg-white rounded-lg shadow-md p-4 border-red-500 h-[130px] w-[100x]">
            <h2 className="text-1 font-semibold text-gray-600">PROMOTIONS</h2>

            <p className="text-4xl font-bold text-black-500 mt-2">3</p>
            <h2 className="text-sm font-semibold text-black-600 mt-2">Ready for clients</h2>
          </div>


          <div className="bg-white rounded-lg shadow-md p-4 border-red-500 h-[130px] w-[100x]">
            <h2 className="text-1 font-semibold text-gray-600">VIEWS</h2>

            <p className="text-4xl font-bold text-black-500 mt-2">15</p>
            <h2 className="text-sm font-semibold text-black-600 mt-2">This week</h2>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;
