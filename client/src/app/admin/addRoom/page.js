"use client";
import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const CREATE_ROOM = gql`
  mutation CreateRoom($input: RoomInput!) {
    createRoom(input: $input) {
      id
      name
      type
      price
    }
  }
`;

const AddRoom = () => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    price: "",
    description: "",
    image: "",
  });

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token"); // or from cookies
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded = jwt_decode(token);
      if (decoded.role !== "admin") {
        router.push("/unauthorized");
      }
    } catch (err) {
      router.push("/login");
    }
  }, [router]);


  const [createRoom, { loading }] = useMutation(CREATE_ROOM, {
    onCompleted: () => {
      toast.success("Room added successfully");
      setFormData({ name: "", type: "", price: "", description: "", image: "" });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createRoom({ variables: { input: { ...formData, price: parseFloat(formData.price) } } });
  };

  return (
    <div className="max-w-lg mx-auto p-5">
      <h2 className="text-2xl font-bold mb-4">Add New Room</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Room Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Type (e.g. Deluxe)"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-900 text-white px-4 py-2 rounded"
        >
          {loading ? "Saving..." : "Add Room"}
        </button>
      </form>
    </div>
  );
};

export default AddRoom;
