import { Card } from "./Card";
import { BadgeCheck, Mail, User, Shield, XCircle, Ban } from "lucide-react"; // beautiful icons

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UserCard: React.FC<{ user: any }> = ({ user }) => {
    const statusBadge = (label: string, condition: boolean, trueColor: string, falseColor: string) => (
        <span
            className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold ${condition
                ? `bg-${trueColor}-100 text-${trueColor}-700`
                : `bg-${falseColor}-100 text-${falseColor}-700`
                }`}
        >
            {condition ? "Yes" : "No"}
        </span>
    );

    return (
        <Card
            title="User Information"
            contentClassName="space-y-6 text-gray-900"
        >
            {/* Header with Avatar */}
            <div className="flex items-center space-x-4 pb-4 border-b border-gray-200">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-semibold shadow-md">
                    {user.firstName?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">
                        {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-gray-500 text-sm flex items-center gap-1">
                        <Mail className="w-4 h-4 text-gray-400" /> {user.email}
                    </p>
                </div>
            </div>

            {/* Grid Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                    <span className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-1">
                        <BadgeCheck className="w-4 h-4 text-indigo-500" /> Verified
                    </span>
                    {statusBadge("Verified", user.isVerified, "green", "red")}
                </div> */}

                <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                    <span className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-1">
                        <Ban className="w-4 h-4 text-red-500" /> Blocked
                    </span>
                    {statusBadge("Blocked", user.isBlocked, "red", "green")}
                </div>

                <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                    <span className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-1">
                        <XCircle className="w-4 h-4 text-red-400" /> Deleted
                    </span>
                    {statusBadge("Deleted", user.isDeleted, "red", "green")}
                </div>

                {/* <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                    <span className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-1">
                        <Shield className="w-4 h-4 text-blue-500" /> Role
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                        {user.role || "N/A"}
                    </span>
                </div> */}
            </div>
        </Card>
    );
};
