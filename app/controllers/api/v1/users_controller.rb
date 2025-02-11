module Api
    module V1
      class UsersController < ApplicationController
        before_action :admin_only

        def index
          users = User.order(:id);
          render json: UserSerializer.new(users).serialized_json
        end

        def show
          user = User.find(params[:id])
          render json: UserSerializer.new(user).serialized_json
        end

        def update
          user = User.find(params[:id])

          if params[:user][:role] && !['user', 'admin'].include?(params[:user][:role])
            params[:user][:role] = 'user'
          end

          if user.super_admin? && (params[:user][:role] != 'admin')
            render json: { errors: ['Cannot change role of superadmin account.'] }, status: :forbidden
            return
          end

          if user.update(user_params)
            render json: UserSerializer.new(user).serialized_json
          else
            error_messages = user.errors.full_messages
            render json: { errors: error_messages }, status: :unprocessable_entity
          end
        end

        private

        def user_params
          params.require(:user).permit(:email, :first_name, :last_name, :role)
        end

        def admin_only
          unless current_user&.admin?
            render json: { errors: ['Access denied.'] }, status: :forbidden
          end
        end
      end
    end
  end