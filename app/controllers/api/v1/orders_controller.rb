module Api
    module V1
        class OrdersController < ApplicationController
            before_action :authenticate_user!
            before_action :set_order, only: [:show]

            def index
                @orders = current_user.orders.includes(order_descriptions: :item)
                render json: @orders, include: { order_descriptions: { include: :item } }
            end

            def show
                render json: @order, include: { order_descriptions: { include: :item } }
            end

            def create
                @order = current_user.orders.new(order_params)

                if params[:order_descriptions].present?
                    params[:order_descriptions].each do |description_params|
                        @order.order_descriptions.new(description_params.permit(:quantity, :order_id, :item_id))
                    end
                end

                if @order.save
                    render json: @order, include: { order_descriptions: { include: :item } }, status: :created
                else
                    render json: { errors: @order.errors.full_messages }, status: :unprocessable_entity
                end
            end

            private

            def set_order
                @order = current_user.orders.find_by(id: params[:id])
                if @order.nil?
                  render json: { error: 'Order not found or does not belong to the current user' }, status: :not_found
                end
            end

            def order_params
                params.require(:order).permit(:user_id, :amount)
            end
        end
    end
end