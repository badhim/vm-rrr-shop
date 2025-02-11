module Api
  module V1
    class ItemsController < ApplicationController
      before_action :admin_only, only: %i[create update destroy]

      def index
        search_term = params[:search]

        if search_term.present?
          items = Item.where('LOWER(name) LIKE ? OR LOWER(description) LIKE ?', "%#{search_term.downcase}%", "%#{search_term.downcase}%").order(:created_at)
        else
          items = Item.all.order(:created_at)
        end

        render json: ItemSerializer.new(items).serialized_json
      end

      def show
        item = Item.find(params[:id])
        render json: ItemSerializer.new(item).serialized_json
      end

      def create
        item = Item.new(item_params)

        if item.save
          render json: ItemSerializer.new(item).serialized_json
        else
          error_messages = item.errors.full_messages
          render json: { errors: error_messages }, status: :unprocessable_entity
        end
      end

      def update
        item = Item.find(params[:id])

        if item.update(item_params)
          render json: ItemSerializer.new(item).serialized_json
        else
          error_messages = item.errors.full_messages
          render json: { errors: error_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        item = Item.find(params[:id])

        if OrderDescription.exists?(item_id: item.id)
          render json: { errors: ['Item is attached to an order and cannot be deleted.'] }, status: :forbidden
          return
        end

        if item.destroy
          head :no_content
        else
          error_messages = item.errors.full_messages
          render json: { errors: error_messages }, status: :unprocessable_entity
        end
      end

      private

      def item_params
        params.require(:item).permit(:name, :description, :image_url, :price)
      end

      def admin_only
        unless current_user&.admin?
          render json: { errors: ['Access denied.'] }, status: :forbidden
        end
      end
    end
  end
end