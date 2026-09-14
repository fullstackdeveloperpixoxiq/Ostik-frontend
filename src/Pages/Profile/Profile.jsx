import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  MapPin,
  Phone,
  Globe,
  Pencil,
  Trash2,
  Plus,
  X,
  Save,
  LogOut,
  Camera,
} from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editMode, setEditMode] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: "",
    country: "",
    preferredcurrency: "",
  });

  // Selected profile image file
  const [profileImageFile, setProfileImageFile] = useState(null);

  // Temporary preview before saving
  const [profileImagePreview, setProfileImagePreview] = useState("");

  const [addressModal, setAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  const [addressForm, setAddressForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  // =========================================================
  // FETCH PROFILE
  // =========================================================

  const fetchProfile = async () => {
    try {
      if (!token) {
        navigate("/login");
        return;
      }

      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/user/profile",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/login");
          return;
        }

        throw new Error(data.message || "Failed to fetch profile");
      }

      setUser(data.user);

      setProfileForm({
        name: data.user.name || "",
        country: data.user.country || "India",
        preferredcurrency: data.user.preferredcurrency || "INR",
      });

      setProfileImagePreview(data.user.profileImage || "");
      setProfileImageFile(null);
    } catch (error) {
      console.error("Profile error:", error);
      toast.error(error.message || "Unable to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // =========================================================
  // PROFILE INPUT
  // =========================================================

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // PROFILE IMAGE CHANGE
  // =========================================================

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Only allow image files
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Optional size limit: 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setProfileImageFile(file);

    // Create temporary preview
    const previewUrl = URL.createObjectURL(file);
    setProfileImagePreview(previewUrl);
  };

  // =========================================================
  // UPDATE PROFILE
  // =========================================================

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      setSavingProfile(true);

      const formData = new FormData();

      formData.append("name", profileForm.name);
      formData.append("country", profileForm.country);
      formData.append(
        "preferredcurrency",
        profileForm.preferredcurrency
      );

      // Only append image when user selects a new image
      if (profileImageFile) {
        formData.append("profileImage", profileImageFile);
      }

      const response = await fetch(
        "http://localhost:5000/api/user/profile",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update profile"
        );
      }

      toast.success("Profile updated successfully");

      setEditMode(false);
      setProfileImageFile(null);

      // Refresh profile from backend
      await fetchProfile();
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error(
        error.message || "Failed to update profile"
      );
    } finally {
      setSavingProfile(false);
    }
  };

  // =========================================================
  // ADDRESS INPUT
  // =========================================================

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setAddressForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // OPEN ADD ADDRESS
  // =========================================================

  const openAddAddress = () => {
    setEditingAddressId(null);

    setAddressForm({
      name: "",
      phone: "",
      email: user?.email || "",
      address: "",
      city: "",
      pincode: "",
    });

    setAddressModal(true);
  };

  // =========================================================
  // OPEN EDIT ADDRESS
  // =========================================================

  const openEditAddress = (address) => {
    setEditingAddressId(address._id);

    setAddressForm({
      name: address.name || "",
      phone: address.phone || "",
      email: address.email || user?.email || "",
      address: address.address || "",
      city: address.city || "",
      pincode: address.pincode || "",
    });

    setAddressModal(true);
  };

  // =========================================================
  // SAVE ADDRESS
  // =========================================================

  const handleSaveAddress = async (e) => {
    e.preventDefault();

    try {
      setSavingAddress(true);

      const url = editingAddressId
        ? `http://localhost:5000/api/user/profile/address/${editingAddressId}`
        : "http://localhost:5000/api/user/profile";

      const method = editingAddressId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save address"
        );
      }

      toast.success(
        editingAddressId
          ? "Address updated successfully"
          : "Address added successfully"
      );

      setAddressModal(false);
      setEditingAddressId(null);

      await fetchProfile();
    } catch (error) {
      console.error("Address error:", error);

      toast.error(
        error.message || "Failed to save address"
      );
    } finally {
      setSavingAddress(false);
    }
  };

  // =========================================================
  // DELETE ADDRESS
  // =========================================================

  const handleDeleteAddress = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/user/profile/address/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete address"
        );
      }

      toast.success("Address deleted successfully");

      await fetchProfile();
    } catch (error) {
      console.error("Delete address error:", error);

      toast.error(
        error.message || "Failed to delete address"
      );
    }
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully");

    navigate("/login");
  };

  // =========================================================
  // CANCEL PROFILE EDIT
  // =========================================================

  const handleCancelEdit = () => {
    setEditMode(false);

    setProfileImageFile(null);

    setProfileImagePreview(user?.profileImage || "");

    setProfileForm({
      name: user?.name || "",
      country: user?.country || "India",
      preferredcurrency: user?.preferredcurrency || "INR",
    });
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-[#00ff03] rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-gray-500 text-sm">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

      <div className="max-w-6xl mx-auto">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">
              Account
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold text-black">
              My Profile
            </h1>

            <p className="text-gray-500 mt-2 text-sm">
              Manage your personal information and addresses.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-black text-white text-sm font-medium hover:bg-[#00ff03] hover:text-black transition-all duration-300"
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>

        {/* =====================================================
            PROFILE CARD
        ===================================================== */}

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

          {/* TOP PROFILE AREA */}

          <div className="p-6 sm:p-8 border-b border-gray-200">

            <div className="flex flex-col sm:flex-row sm:items-center gap-6">

              {/* PROFILE IMAGE */}

              <div className="relative shrink-0">

                {profileImagePreview ? (
                  <img
                    src={profileImagePreview}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-4 border-gray-50">
                    <UserRound
                      size={38}
                      className="text-gray-500"
                    />
                  </div>
                )}

                {/* CAMERA BUTTON */}

                {editMode && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-black text-white flex items-center justify-center border-2 border-white hover:bg-[#00ff03] hover:text-black transition-all"
                      title="Change profile image"
                    >
                      <Camera size={16} />
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      className="hidden"
                    />
                  </>
                )}

              </div>

              {/* USER INFO */}

              <div className="flex-1">

                <h2 className="text-2xl font-bold text-black">
                  {user.name}
                </h2>

                <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
                  <Mail size={16} />
                  <span>{user.email}</span>
                </div>

                {user.isEmailVerified && (
                  <span className="inline-block mt-3 px-3 py-1 rounded-full bg-[#00ff03]/10 text-green-700 text-xs font-medium">
                    Email verified
                  </span>
                )}

                {editMode && (
                  <p className="text-xs text-gray-400 mt-3">
                    Click the camera icon to change your profile picture.
                  </p>
                )}

              </div>

              {/* EDIT BUTTON */}

              <button
                onClick={() => {
                  if (editMode) {
                    handleCancelEdit();
                  } else {
                    setEditMode(true);
                  }
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium hover:border-black hover:bg-black hover:text-white transition-all"
              >
                {editMode ? (
                  <>
                    <X size={17} />
                    Cancel
                  </>
                ) : (
                  <>
                    <Pencil size={17} />
                    Edit Profile
                  </>
                )}
              </button>

            </div>

          </div>

          {/* ===================================================
              PERSONAL INFORMATION
          =================================================== */}

          <div className="p-6 sm:p-8">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-9 h-9 rounded-lg bg-[#00ff03]/15 flex items-center justify-center">
                <UserRound size={18} />
              </div>

              <div>
                <h3 className="font-semibold text-black">
                  Personal Information
                </h3>

                <p className="text-xs text-gray-500">
                  Your account details
                </p>
              </div>

            </div>

            {editMode ? (

              <form
                onSubmit={handleUpdateProfile}
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
              >

                {/* NAME */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#00ff03]"
                    required
                  />
                </div>

                {/* EMAIL */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>

                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-200 bg-gray-100 rounded-lg text-gray-500"
                  />
                </div>

                {/* COUNTRY */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>

                  <input
                    type="text"
                    name="country"
                    value={profileForm.country}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#00ff03]"
                  />
                </div>

                {/* CURRENCY */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Currency
                  </label>

                  <select
                    name="preferredcurrency"
                    value={profileForm.preferredcurrency}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#00ff03] bg-white"
                  >
                    <option value="INR">
                      INR - Indian Rupee
                    </option>

                    <option value="USD">
                      USD - US Dollar
                    </option>

                    <option value="EUR">
                      EUR - Euro
                    </option>

                    <option value="GBP">
                      GBP - British Pound
                    </option>
                  </select>
                </div>

                {/* PROFILE IMAGE */}

                <div className="md:col-span-2">

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Image
                  </label>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                    {/* PREVIEW */}

                    <div className="shrink-0">

                      {profileImagePreview ? (
                        <img
                          src={profileImagePreview}
                          alt="Profile preview"
                          className="w-16 h-16 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                          <UserRound
                            size={25}
                            className="text-gray-400"
                          />
                        </div>
                      )}

                    </div>

                    {/* UPLOAD BUTTON */}

                    <div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          fileInputRef.current?.click()
                        }
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium hover:border-black hover:bg-black hover:text-white transition-all"
                      >
                        <Camera size={16} />
                        Choose Image
                      </button>

                      <p className="text-xs text-gray-400 mt-2">
                        JPG, PNG, WEBP · Maximum 5MB
                      </p>

                      {profileImageFile && (
                        <p className="text-xs text-green-600 mt-1">
                          Selected: {profileImageFile.name}
                        </p>
                      )}

                    </div>

                  </div>

                </div>

                {/* SAVE BUTTON */}

                <div className="md:col-span-2">

                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg text-sm font-medium hover:bg-[#00ff03] hover:text-black transition-all disabled:opacity-50"
                  >
                    <Save size={17} />

                    {savingProfile
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                </div>

              </form>

            ) : (

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                {/* NAME */}

                <div className="bg-gray-50 rounded-xl p-5">
                  <p className="text-xs text-gray-500 mb-2">
                    Full Name
                  </p>

                  <p className="font-medium text-black">
                    {user.name}
                  </p>
                </div>

                {/* EMAIL */}

                <div className="bg-gray-50 rounded-xl p-5">
                  <p className="text-xs text-gray-500 mb-2">
                    Email
                  </p>

                  <p className="font-medium text-black break-all">
                    {user.email}
                  </p>
                </div>

                {/* COUNTRY */}

                <div className="bg-gray-50 rounded-xl p-5">
                  <p className="text-xs text-gray-500 mb-2">
                    Country
                  </p>

                  <div className="flex items-center gap-2 font-medium text-black">
                    <Globe size={16} />
                    {user.country || "India"}
                  </div>
                </div>

                {/* CURRENCY */}

                <div className="bg-gray-50 rounded-xl p-5">
                  <p className="text-xs text-gray-500 mb-2">
                    Preferred Currency
                  </p>

                  <p className="font-medium text-black">
                    {user.preferredcurrency || "INR"}
                  </p>
                </div>

                {/* ACCOUNT STATUS */}

                <div className="bg-gray-50 rounded-xl p-5">
                  <p className="text-xs text-gray-500 mb-2">
                    Account Status
                  </p>

                  <p className="font-medium text-green-600">
                    {user.isActive ? "Active" : "Inactive"}
                  </p>
                </div>

              </div>

            )}

          </div>

        </div>

        {/* =====================================================
            ADDRESSES
        ===================================================== */}

        <div className="mt-8">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">

            <div>
              <h2 className="text-2xl font-bold text-black">
                My Addresses
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Manage your delivery addresses.
              </p>
            </div>

            <button
              onClick={openAddAddress}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-black text-white text-sm font-medium hover:bg-[#00ff03] hover:text-black transition-all"
            >
              <Plus size={17} />
              Add Address
            </button>

          </div>

          {user.addresses && user.addresses.length > 0 ? (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {user.addresses.map((address) => (

                <div
                  key={address._id}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-lg bg-[#00ff03]/15 flex items-center justify-center">
                        <MapPin size={19} />
                      </div>

                      <div>
                        <h3 className="font-semibold text-black">
                          {address.name}
                        </h3>

                        <p className="text-xs text-gray-500">
                          Delivery Address
                        </p>
                      </div>

                    </div>

                    <div className="flex items-center gap-1">

                      <button
                        onClick={() =>
                          openEditAddress(address)
                        }
                        className="p-2 rounded-lg hover:bg-gray-100"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteAddress(address._id)
                        }
                        className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  </div>

                  <div className="mt-5 space-y-3 text-sm">

                    <div className="flex gap-3 text-gray-600">
                      <Phone
                        size={16}
                        className="shrink-0 mt-0.5"
                      />

                      <span>{address.phone}</span>
                    </div>

                    {address.email && (
                      <div className="flex gap-3 text-gray-600">
                        <Mail
                          size={16}
                          className="shrink-0 mt-0.5"
                        />

                        <span className="break-all">
                          {address.email}
                        </span>
                      </div>
                    )}

                    <div className="flex gap-3 text-gray-600">

                      <MapPin
                        size={16}
                        className="shrink-0 mt-0.5"
                      />

                      <span>
                        {address.address}
                        <br />
                        {address.city} - {address.pincode}
                      </span>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          ) : (

            <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-10 text-center">

              <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                <MapPin
                  size={24}
                  className="text-gray-500"
                />
              </div>

              <h3 className="mt-4 font-semibold text-black">
                No addresses yet
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Add an address for faster checkout.
              </p>

              <button
                onClick={openAddAddress}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-black text-white text-sm hover:bg-[#00ff03] hover:text-black transition-all"
              >
                <Plus size={17} />
                Add Address
              </button>

            </div>

          )}

        </div>

      </div>

      {/* =======================================================
          ADDRESS MODAL
      ======================================================= */}

      {addressModal && (

        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">

            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">

              <div>
                <h2 className="text-xl font-bold text-black">
                  {editingAddressId
                    ? "Edit Address"
                    : "Add New Address"}
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Enter your delivery details
                </p>
              </div>

              <button
                onClick={() => setAddressModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={handleSaveAddress}
              className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5"
            >

              {/* NAME */}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={addressForm.name}
                  onChange={handleAddressChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#00ff03]"
                />
              </div>

              {/* PHONE */}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  value={addressForm.phone}
                  onChange={handleAddressChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#00ff03]"
                />
              </div>

              {/* EMAIL */}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={addressForm.email}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#00ff03]"
                />
              </div>

              {/* PINCODE */}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Pincode
                </label>

                <input
                  type="text"
                  name="pincode"
                  value={addressForm.pincode}
                  onChange={handleAddressChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#00ff03]"
                />
              </div>

              {/* ADDRESS */}

              <div className="sm:col-span-2">

                <label className="block text-sm font-medium mb-2">
                  Address
                </label>

                <textarea
                  name="address"
                  value={addressForm.address}
                  onChange={handleAddressChange}
                  required
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#00ff03] resize-none"
                />

              </div>

              {/* CITY */}

              <div>
                <label className="block text-sm font-medium mb-2">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={addressForm.city}
                  onChange={handleAddressChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#00ff03]"
                />
              </div>

              {/* BUTTONS */}

              <div className="sm:col-span-2 flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => setAddressModal(false)}
                  className="px-5 py-3 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingAddress}
                  className="px-6 py-3 rounded-lg bg-black text-white text-sm font-medium hover:bg-[#00ff03] hover:text-black transition-all disabled:opacity-50"
                >
                  {savingAddress
                    ? "Saving..."
                    : editingAddressId
                    ? "Update Address"
                    : "Save Address"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Profile;