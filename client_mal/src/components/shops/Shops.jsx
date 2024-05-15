import { useSelector, useDispatch } from "react-redux";
import { changeShop } from "../../redux/actions/actions";
import { useNavigate } from "react-router-dom";
import {
    PlusCircleIcon
} from '@heroicons/react/24/solid';
import { getParamsEnv } from "../../functions/getParamsEnv";

const {API_URL_BASE} = getParamsEnv(); 

function Shops() {
    const client = useSelector((state) => state.client);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const selectLocal = (id) => {
        dispatch(changeShop(id));
        navigate("/dashboard");
    };

    return (
        <div className="container mx-auto py-8 mt-[100px] p-5">
            <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-[70px]">
                {client.locals.map((local, index) => (
                    <div
                        onClick={() => selectLocal(local.id)}
                        key={index}
                        className="bg-localCard max-w-sm rounded-lg overflow-hidden shadow-lg border border-gray-300 hover:shadow-xl cursor-pointer"
                    >
                        <img
                            src={`${API_URL_BASE}/${local.img}`}
                            alt={local.name}
                            className="w-full h-36 object-cover"
                        />
                        <div className="px-6 py-4">
                            <div className="font-bold text-xl mb-2">{local.name}</div>
                            <p className="text-gray-700 text-base">{local.address}</p>
                        </div>
                    </div>
                ))}
                <button

                className="mb-5 ml-[10px] max-w-[200px] flex items-center gap-2 px-3 py-1 bg-blue-400 rounded-md focus:outline-none hover:bg-blue-200"
            >
                <PlusCircleIcon className="h-5 w-5" />
                Add New Shop
            </button>
            </div>
        </div>
    );
}

export default Shops;
