class ItemSerializer
  include FastJsonapi::ObjectSerializer
  attributes :name, :description, :image_url, :price
end
