import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    isDefault: false,
  });

  const [formErrors, setFormErrors] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const handleInputChange = (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;

    setNewAddress({
      ...newAddress,
      [event.target.name]: value,
    });
  };

  const handleAddressSelect = (address) => {
    setFormErrors({
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    });
    setSelectedAddress(address);
    setNewAddress({ ...address });
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    };

    if (!newAddress.street.trim()) {
      errors.street = "Street is required";
      isValid = false;
    }

    if (!newAddress.city.trim()) {
      errors.city = "City is required";
      isValid = false;
    }

    if (!newAddress.state.trim()) {
      errors.state = "State is required";
      isValid = false;
    }

    if (!newAddress.zip.trim()) {
      errors.zip = "Zip code is required";
      isValid = false;
    } else if (!/^\d{5}(-\d{4})?$/.test(newAddress.zip.trim())) {
      errors.zip = "Invalid zip code format";
      isValid = false;
    }

    if (!newAddress.country.trim()) {
      errors.country = "Country is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleAddressUpdate = async () => {
    try {
      if (!validateForm()) {
        return;
      }

      const url = selectedAddress
        ? `${process.env.REACT_APP_USER_BASE_URL}/update-one-address`
        : `${process.env.REACT_APP_USER_BASE_URL}/update-user-address`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ address: newAddress }),
      });

      const data = await response.json();
      if (data.statusCode !== 200) {
        toast.error(data.message);
      }

      const userResponse = await fetch(
        `${process.env.REACT_APP_USER_BASE_URL}/me`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const userData = await userResponse.json();
      if (data.statusCode === 403) {
        localStorage.removeItem("token");
        return;
      } else if (data.statusCode !== 200) {
        toast.error(data.message);
      }

      setAddresses(userData.data.address);
      setSelectedAddress(null);
      setNewAddress({
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
        isDefault: false,
      });
    } catch (error) {
      console.error("Error:", error);
      // Handle the error as needed
    }
  };

  const handleCancelUpdate = () => {
    setSelectedAddress(null);
    setNewAddress({
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      isDefault: false,
    });
    setFormErrors({
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    async function fetchData() {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_USER_BASE_URL}/me`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (data.statusCode === 403) {
          localStorage.removeItem("token");
          return;
        } else if (data.statusCode !== 200) {
          toast.error(data.message);
        }
        setUser(data.data);
        setAddresses(data.data.address);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    fetchData();
  }, [isAuthenticated]);

  return (
    <>
      {isAuthenticated && (
        <div className="flex items-center justify-center h-screen bg-gradient-to-b from-rose-200 via-pink-100 to-cyan-200">
          <div className="w-full max-w-screen-lg bg-[#20354b] rounded-2xl px-8 py-6 shadow-lg flex">
            <div className="w-1/2 pr-8">
              <div className="mt-8">
                <h2 className="text-white font-bold text-2xl tracking-wide">
                  {user.name}
                </h2>
              </div>
              <div className="mt-4">
                <h3 className="text-white font-semibold text-lg mb-2 justify-between flex items-center">
                  Your Addresses:
                </h3>
                <div
                  className="max-h-80 overflow-y-auto"
                  style={{ scrollbarWidth: "thin" }}
                >
                  {addresses.length > 0 ? (
                    <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                      {addresses.map((address) => (
                        <li
                          key={address.id}
                          onClick={() => handleAddressSelect(address)}
                          className={`cursor-pointer p-4 border rounded hover:shadow-md ${
                            selectedAddress?.id === address.id
                              ? "border-emerald-400"
                              : "border-[#20354b]"
                          }`}
                        >
                          {address.isDefault && (
                            <span className="text-emerald-400 text-xs">
                              Default Address
                            </span>
                          )}
                          <p className="text-white font-semibold mb-2">
                            {`${address.street}, ${address.city}`}
                          </p>
                          <p className="text-gray-400">
                            {`${address.state}, ${address.zip}, ${address.country}`}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-white">No addresses available.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="w-1/2">
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <h3 className="text-white font-semibold text-lg mb-4">
                  {selectedAddress ? "Update Address" : "Add Address"}
                </h3>
                {/* Input fields for address */}
                <div className="mb-4">
                  <label className="block text-white text-sm mb-1 text-left">
                    Street
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={newAddress.street}
                    onChange={handleInputChange}
                    placeholder="Street"
                    required
                    className={`w-full px-3 py-2 rounded ${
                      formErrors.street ? "border border-red-500" : ""
                    }`}
                  />
                  <p className="text-red-500 text-xs">{formErrors.street}</p>
                </div>
                <div className="mb-4">
                  <label className="block text-white text-sm mb-1 text-left">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={newAddress.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    required
                    className={`w-full px-3 py-2 rounded ${
                      formErrors.city ? "border border-red-500" : ""
                    }`}
                  />
                  <p className="text-red-500 text-xs">{formErrors.city}</p>
                </div>
                <div className="mb-4">
                  <label className="block text-white text-sm mb-1 text-left">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={newAddress.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    required
                    className={`w-full px-3 py-2 rounded ${
                      formErrors.state ? "border border-red-500" : ""
                    }`}
                  />
                  <p className="text-red-500 text-xs">{formErrors.state}</p>
                </div>
                <div className="mb-4">
                  <label className="block text-white text-sm mb-1 text-left">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    name="zip"
                    value={newAddress.zip}
                    onChange={handleInputChange}
                    placeholder="Zip Code"
                    required
                    className={`w-full px-3 py-2 rounded ${
                      formErrors.zip ? "border border-red-500" : ""
                    }`}
                  />
                  <p className="text-red-500 text-xs">{formErrors.zip}</p>
                </div>
                <div className="mb-4">
                  <label className="block text-white text-sm mb-1 text-left">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={newAddress.country}
                    onChange={handleInputChange}
                    placeholder="Country"
                    required
                    className={`w-full px-3 py-2 rounded ${
                      formErrors.country ? "border border-red-500" : ""
                    }`}
                  />
                  <p className="text-red-500 text-xs">{formErrors.country}</p>
                </div>
                <div className="mb-4 flex items-center">
                  <input
                    type="checkbox"
                    id="isDefaultCheckbox"
                    name="isDefault"
                    checked={newAddress.isDefault}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label
                    htmlFor="isDefaultCheckbox"
                    className="text-white text-sm cursor-pointer"
                  >
                    Mark as Default
                  </label>
                </div>

                <div className="flex space-x-4 justify-end">
                  <button
                    onClick={handleAddressUpdate}
                    className="bg-emerald-400 py-2 px-4 text-white rounded font-semibold"
                  >
                    {selectedAddress ? "Update Address" : "Add Address"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelUpdate}
                    className="bg-gray-400 py-2 px-4 text-white rounded font-semibold"
                  >
                    {selectedAddress ? "Cancel" : "Clear"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
