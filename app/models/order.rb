class Order < ApplicationRecord
  has_many :order_descriptions
  belongs_to :user
end
