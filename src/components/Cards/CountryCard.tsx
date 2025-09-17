// components/CountryCard.tsx
// import { useRouter } from 'next/router';
import { useRouter } from 'next/navigation';
import { MdDelete } from 'react-icons/md';

type CountryCardProps = {
  data: {
    _id: string;
    name: string;
    isoCode: string;
    iso3Code: string;
    currency: string;
    phoneCode: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  onDelete: (id: string) => void;
};

const CountryCard: React.FC<CountryCardProps> = ({ data, onDelete }) => {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/admin/country/${data._id}`);
  };

  return (
    <div
      className="flex flex-col bg-[#16325d] hover:bg-[#244a85] rounded-xl shadow-md transition cursor-pointer p-6 relative"
      onClick={handleNavigate}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white">{data.name}</h2>
        {data.isActive && (
          <span className="px-2 py-1 bg-[#37c74f] text-white text-xs rounded shadow">
            Active
          </span>
        )}
      </div>
      <div className="text-white text-sm space-y-1">
        <div>
          <span className="font-medium">Currency:</span> {data.currency}
        </div>
        <div>
          <span className="font-medium">ISO Code:</span> {data.isoCode}
        </div>
        <div>
          <span className="font-medium">ISO3 Code:</span> {data.iso3Code}
        </div>
        <div>
          <span className="font-medium">Phone:</span> {data.phoneCode}
        </div>
        <div>
          <span className="font-medium">Created:</span> {new Date(data.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
        </div>
      </div>
      <button
        className="absolute bottom-4 right-4 rounded-full bg-red-600 hover:bg-red-800 p-2 transition"
        onClick={e => {
          e.stopPropagation();
          onDelete(data._id);
        }}
        aria-label="Delete"
      >
        <MdDelete size={22} color="#fff" />
      </button>
    </div>
  );
};

export default CountryCard;
