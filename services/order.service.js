  const OrderModel = require("../models/order");
  const ObjectId = require("mongoose").Types.ObjectId;
  const ProductModel = require("../models/product");
  const randomCode = require("../utils/code");
  const AddressService = require("../services/address.services");
  const CartService = require("../services/cart.service");
  const UserService = require("../services/user.service");
  const Inventory_EntriesService = require("../services/inventory_entries.service");
  const payment_method = require("../models/payment_method");
  const code = randomCode();
  class OrderService {
    static addOrder = async (
      id_user,
      id_account,
      province,
      district,
      commune,
      desc
    ) => {
      try {
        const ID_USER = new ObjectId(id_user);
        const ID_ACCOUNT = new ObjectId(id_account);
        const PhoneUser = await UserService.getNumberPhoneUser(ID_ACCOUNT);
        const ListProductData = await CartService.getAllCart(ID_USER);
        if (!ListProductData || ListProductData.length === 0) {
          return {
            success: false,
            message: "Không có sản phẩm nào trong giỏ hàng",
          };
        } else {
          const ListProduct = ListProductData.map((cart) => ({
            ID_PRODUCT: cart.ITEM.ID_PRODUCT,
            FROM_DATE: cart.ITEM.FROM_DATE,
            TO_DATE: cart.ITEM.TO_DATE,
            UNITPRICES: cart.ITEM.PRICE,
            QLT: cart.ITEM.QUANTITY,
            LIST_MATCH_KEY: cart.ITEM.LIST_MATCH_KEY,
            ID_KEY_VALUE: cart.ITEM.ID_KEY_VALUE,
            NUMBER_PRODUCT: cart.ITEM.NUMBER_PRODUCT,
          }));
          const newOrder = await OrderModel.create({
            ORDER_CODE: null,
            PHONE_USER: PhoneUser,
            LIST_PRODUCT: ListProduct,
            ACCOUNT__ID: ID_ACCOUNT,
            PAYMENT_METHOD: null,
            IS_PAYMENT: false,
            TIME_PAYMENT: null,
            CANCEL_REASON: null,
            ADDRESS_USER: {
              PROVINCE: province,
              DISTRICT: district,
              COMMUNE: commune,
              DESC: desc,
            },
            ORDER_STATUS: 'Chờ Duyệt', // Đặt giá trị hợp lệ

          });
          return newOrder;
        }
      } catch (error) {
        console.error("Error in addOrder:", error.message);
        throw error; // Re-throw the error to be handled by the calling function
      }
    };

    static updateOrderCode = async (orderCode) => {
      const lastOrder = await OrderModel.findOne({ ORDER_CODE: null }).sort({
        _id: -1,
      });
      if (lastOrder) {
        const update = await OrderModel.updateOne(
          { _id: lastOrder._id },
          {
            ORDER_CODE: orderCode,
          }
        );
        return update;
      }
    };
    static updateStatusOrderMomo = async (orderCode, payment_method) => {
      const update = await OrderModel.updateOne(
        { ORDER_CODE: orderCode },
        {
          IS_PAYMENT: true,
          TIME_PAYMENT: new Date(),
          PAYMENT_METHOD: payment_method,
        }
      );
      return update;
    };
    static updateStatusOrderZaloPay = async (orderCode, payment_method) => {
      const update = await OrderModel.updateOne(
        { ORDER_CODE: orderCode },
        {
          IS_PAYMENT: true,
          TIME_PAYMENT: new Date(),
          PAYMENT_METHOD: payment_method,
        }
      );
      return update;
    };
    static updateStatusCOD = async (orderCode, payment_method) => {
      const lastOrder = await OrderModel.findOne({ ORDER_CODE: null }).sort({
        _id: -1,
      });

      if (lastOrder) {
        const update = await OrderModel.updateOne(
          { _id: lastOrder._id },
          {
            ORDER_CODE: orderCode,
            IS_PAYMENT: false,
            TIME_PAYMENT: null,
            PAYMENT_METHOD: payment_method,
            TIME_PAYMENT: new Date(),
          }
        );
        return update;
      } else {
        return null;
      }
    };

    // trạng thái chờ thanh toán
    static statusOrder1 = async (id_account) => {
      const ID_ACCOUNT = new ObjectId(id_account);
      const lastOrder = await OrderModel.findOne({
        ACCOUNT__ID: ID_ACCOUNT,
      }).sort({ _id: -1 });
      if (lastOrder) {
        const updateStatus = await OrderModel.updateOne(
          {
            _id: lastOrder.id,
          },
          {
            $set: {
              LIST_STATUS: {
                STATUS_NAME: "Chờ thanh toán",
                STATUS_CODE: 1,
                FROM_DATE: new Date(),
                TO_DATE: null,
              },
            },
          }
        );
        return updateStatus;
      }
    };
    // trạng thái đã thanh toán
  static statusOrder2 = async (orderId) => {
      const lastOrder = await OrderModel.findById(orderId);
      if (lastOrder) {
          await OrderModel.updateOne(
              {
                  _id: lastOrder._id,
                  "LIST_STATUS.TO_DATE": null,
              },
              {
                  $set: {
                      "LIST_STATUS.$.TO_DATE": new Date(),
                  },
              }
          );
          await OrderService.updateNumberProductPayment(
              lastOrder.LIST_PRODUCT[0].ID_PRODUCT,
              lastOrder.LIST_PRODUCT[0].ID_KEY_VALUE,
              lastOrder.LIST_PRODUCT[0].QLT
          );
          await Inventory_EntriesService.updateNumberInventoryProduct(
              lastOrder.LIST_PRODUCT[0].ID_PRODUCT
          );
          const updateStatus = await OrderModel.updateOne(
              {
                  _id: lastOrder._id,
              },
              {
                  $push: {
                      LIST_STATUS: {
                          STATUS_NAME: "Đã thanh toán",
                          STATUS_CODE: 3,
                          FROM_DATE: new Date(),
                          TO_DATE: null,
                      },
                  },
              }
          );
          return updateStatus;
      }
  };

  static updateOrderStatusToProcessing = async (orderId) => {
      try {
          const updatedOrder = await OrderModel.findByIdAndUpdate(
              orderId,
              {
                  $set: {
                      ORDER_STATUS: 'Đang xử lý', // Cập nhật trạng thái
                  },
                  $push: {
                      STATUS_HISTORY: { 
                          status: 'Đang xử lý', 
                          updatedAt: new Date(), 
                      },
                  },
              },
              { new: true } // Trả về đơn hàng đã cập nhật
          );

          return updatedOrder;
      } catch (error) {
          console.error("Error in updateOrderStatusToProcessing:", error.message);
          throw new Error("Cập nhật trạng thái đơn hàng thất bại");
      }
  };

  static updateOrderToShipping = async (orderId) => {
      try {
          const updatedOrder = await OrderModel.findByIdAndUpdate(
              orderId,
              {
                  $set: {
                      ORDER_STATUS: 'Đang vận chuyển', // Cập nhật trạng thái
                  },
                  $push: {
                      STATUS_HISTORY: { // Thêm lịch sử trạng thái
                          status: 'Đang vận chuyển', // Sửa đổi thành 'status'
                          updatedAt: new Date(), // Thêm thời gian cập nhật
                      },
                  },
              },
              { new: true } // Trả về đơn hàng đã cập nhật
          );

          return updatedOrder;
      } catch (error) {
          console.error("Error in updateOrderToShipping:", error.message);
          throw new Error("Cập nhật trạng thái đơn hàng thất bại");
      }
    };
    static updateOrderStatusSuccess = async (orderId) => {
      try {
          const updatedOrder = await OrderModel.findByIdAndUpdate(
              orderId,
              {
                  $set: {
                      ORDER_STATUS: 'Đã giao', // Cập nhật trạng thái
                  },
                  $push: {
                      STATUS_HISTORY: { // Thêm lịch sử trạng thái
                          status: 'Đã giao', 
                          updatedAt: new Date(), // Thêm thời gian cập nhật
                      },
                  },
              },
              { new: true } // Trả về đơn hàng đã cập nhật
          );

          return updatedOrder;
      } catch (error) {
          console.error("Error in updateOrderStatusToDelivered:", error.message);
          throw new Error("Cập nhật trạng thái đơn hàng thất bại");
      }
  };






    static statusOrder2COD = async (id_account) => {
      const ID_ACCOUNT = new ObjectId(id_account);
      const lastOrder = await OrderModel.findOne({
        ACCOUNT__ID: ID_ACCOUNT,
      }).sort({ _id: -1 });
      // lastOrder.LIST_PRODUCT[0].ID_PRODUCT
      // lastOrder.LIST_PRODUCT[0].NUMBER_PRODUCT
      // lastOrder.LIST_PRODUCT[0].ID_KEY_VALUE
      if (lastOrder) {
        await OrderModel.updateOne(
          {
            _id: lastOrder._id,
            "LIST_STATUS.TO_DATE": null,
          },
          {
            $set: {
              "LIST_STATUS.$.TO_DATE": new Date(),
            },
          }
        );
        await OrderService.updateNumberProductPayment(
          lastOrder.LIST_PRODUCT[0].ID_PRODUCT,
          lastOrder.LIST_PRODUCT[0].ID_KEY_VALUE,
          lastOrder.LIST_PRODUCT[0].QLT
        );
        await Inventory_EntriesService.updateNumberInventoryProduct(
          lastOrder.LIST_PRODUCT[0].ID_PRODUCT
        );
        const updateStatus = await OrderModel.updateOne(
          {
            _id: lastOrder._id,
          },
          {
            $push: {
              LIST_STATUS: {
                STATUS_NAME: "chưa hoàn thành thanh toán",
                STATUS_CODE: 2,
                FROM_DATE: new Date(),
                TO_DATE: null,
              },
            },
          }
        );
        return updateStatus;
      }
    };
    // static updateOrderStatusToShipping = async (orderCode) => {
    //   const update = await OrderModel.updateOne(
    //     { ORDER_CODE: orderCode },
    //     {
    //       $set: {
    //         "LIST_STATUS": {
    //           STATUS_NAME: "Đang giao hàng",
    //           STATUS_CODE: 3,
    //           FROM_DATE: new Date(),
    //           TO_DATE: null,
    //         },
    //       },
    //     }
    //   );
    //   return update;
    // };
    // Phương thức để lấy đơn hàng theo ID
    static getOrderById = async (orderId) => {
      try {
        const order = await OrderModel.findById(orderId);
        if (!order) {
          throw new Error('Đơn hàng không tồn tại');
        }
        return order;
      } catch (error) {
        console.error("Error in getOrderById:", error.message);
        throw new Error("Lấy đơn hàng thất bại");
      }
    };
    
    // Cập nhật trạng thái thanh toán cho đơn hàng
    static confirmPayment = async (orderId) => {
      try {
        // Lấy đơn hàng hiện tại để giữ lại trạng thái cũ
        const existingOrder = await OrderModel.findById(orderId);
        if (!existingOrder) {
          throw new Error('Đơn hàng không tồn tại');
        }

        // Lưu lại các trạng thái cũ
        const existingStatus = existingOrder.LIST_STATUS;

        // Cập nhật trạng thái thanh toán
        const updatedOrder = await OrderModel.findByIdAndUpdate(
          orderId,
          { 
            $set: { 
              LIST_STATUS: [
                ...existingStatus, // Giữ lại các trạng thái cũ
                { 
                  STATUS_NAME: 'Đã Thanh Toán',
                  STATUS_CODE: 3,
                  FROM_DATE: new Date(),
                  TO_DATE: null,
                },
              ],
              IS_PAYMENT: true, // Cập nhật trạng thái thanh toán
            }
          },
          { new: true } // Trả về đơn hàng đã cập nhật
        );

        return updatedOrder;
      } catch (error) {
        console.error("Error in confirmPayment:", error.message);
        throw new Error("Xác nhận thanh toán thất bại");
      }
    };
    static updateNumberProduct = async (id_account) => {
      try {
        const ID_ACCOUNT = new ObjectId(id_account);
        const order = await OrderModel.aggregate([
          {
            $match: {
              ACCOUNT__ID: ID_ACCOUNT,
            },
          },
          {
            $unwind: "$LIST_PRODUCT",
          },
        ]);

        if (!order || order.length === 0) {
          throw new Error("Order không tồn tại");
        }

        const item = order[0].LIST_PRODUCT; // Vì LIST_PRODUCT là một đối tượng

        let updateQuery = {
          _id: item.ID_PRODUCT,
        };

        if (item.LIST_MATCH_KEY && item.LIST_MATCH_KEY.length > 0) {
          const matchCondition = {
            $and: item.LIST_MATCH_KEY.map((keyValuePair) => ({
              "LIST_MATCH_KEY.KEY": keyValuePair.KEY,
              "LIST_MATCH_KEY.VALUE": keyValuePair.VALUE,
            })),
          };
          updateQuery["QUANTITY_BY_KEY_VALUE"] = { $elemMatch: matchCondition };
        }

        const updateOperation = {
          $inc: {
            "QUANTITY_BY_KEY_VALUE.$.QUANTITY": -item.QLT, // Giả sử bạn muốn trừ đi số lượng
          },
        };

        const updateOptions = {
          new: true,
          runValidators: true,
        };

        let updateQuantity;
        if (item.LIST_MATCH_KEY && item.LIST_MATCH_KEY.length > 0) {
          updateQuantity = await ProductModel.findOneAndUpdate(
            updateQuery,
            updateOperation,
            updateOptions
          );
        } else {
          // Xử lý khi LIST_MATCH_KEY là mảng rỗng
          updateQuantity = await ProductModel.findByIdAndUpdate(
            item.ID_PRODUCT,
            {
              $inc: {
                NUMBER_INVENTORY_PRODUCT: -item.QLT,
              },
            },
            updateOptions
          );
        }

        if (!updateQuantity) {
          throw new Error("Không thể cập nhật số lượng sản phẩm");
        }

        return updateQuantity;
      } catch (error) {
        console.error(error);
        throw new Error(error.message);
      }
    };
    static getUserOrder = async (id_account) => {
      const ID_ACCOUNT = new ObjectId(id_account);
      const order = await OrderModel.aggregate([
        {
          $match: {
            ACCOUNT__ID: ID_ACCOUNT,
            TIME_PAYMENT: { $ne: null },
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "LIST_PRODUCT.ID_PRODUCT",
            foreignField: "_id",
            as: "PRODUCT",
          },
        },
        {
          $unwind: "$PRODUCT",
        },
      ]);
      return order;
    };
    static getAllOrders = async () => {
      try {
        const orders = await OrderModel.find().sort({ _id: -1 }); // Sắp xếp đơn hàng theo thứ tự mới nhất
        return orders;
      } catch (error) {
        console.error("Error in getAllOrders:", error.message);
        throw new Error("Lấy tất cả đơn hàng thất bại");
      }
    };
    // Phương thức lọc đơn hàng theo trạng thái
  static filterOrdersByStatus = async (status) => {
    try {
      const allOrders = await this.getAllOrders(); // Lấy tất cả đơn hàng
      const filteredOrders = allOrders.filter(order => order.ORDER_STATUS === status); // Lọc theo trạng thái
      return filteredOrders;
    } catch (error) {
      throw new Error("Lọc đơn hàng theo trạng thái thất bại: " + error.message);
    }
  };
    static updateNumberProductPayment = async (
      id_product,
      id_key_value,
      number_cart
    ) => {
      const ID_PRODUCT = new ObjectId(id_product);
      const ID_KEY_VALUE = new ObjectId(id_key_value);
      const update = ProductModel.updateOne(
        {
          _id: ID_PRODUCT,

          "QUANTITY_BY_KEY_VALUE._id": ID_KEY_VALUE,
        },
        {
          $inc: {
            "QUANTITY_BY_KEY_VALUE.$.QUANTITY": -number_cart,
          },
        }
      );
      return update;
    };
  }

  module.exports = OrderService;
