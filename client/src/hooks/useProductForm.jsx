import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "../schemas/productSchema";

const useProductForm = ({ defaultValues }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues || {
      title: "",
      description: "",
      price: 0,
      discountType: "percentage",
      discount: 0,
      category: "",
      brand: "",
      quantity: 0,
      stockStatus: "in stock",
      isFeatured: false,
    },
  });

  const discountType = watch("discountType");
  const isFeatured = watch("isFeatured");

  const onSubmit = (data) => {
    // API Call
    console.log("Form Data:", data);
  };

  return {
    register,
    handleSubmit,
    errors,
    watch,
    setValue,
    discountType,
    isFeatured,
    onSubmit,
  };
};

export default useProductForm;
