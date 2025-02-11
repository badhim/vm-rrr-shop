users_ids = []
users_data = [
  { email: 'admin@example.com', password: 'password', first_name: 'Johnny B.', last_name: 'Goode', role: 'admin' },
  { email: 'user@example.com', password: 'password', first_name: 'John', last_name: 'Doe', role: 'user' }
]

items_ids = []
items_data = [
  { name: 'Canon ES40', description: 'Just look at that ZOOM', price: 499.99, image_url: 'product-1.jpg' },
  { name: 'Cardigan', description: "Seems like it's a blue one", price: 15.99, image_url: 'product-2.jpg' },
  { name: 'Abajur Lamp', description: 'Vintage wooden abajur lamp as pictured', price: 102.41, image_url: 'product-3.jpg' },
  { name: 'Nike Sketchers', description: 'Casual shoes for everyday use', price: 32, image_url: 'product-4.jpg' },
  { name: 'Phantom 4 Pro', description: 'With incredible obstacle avoidance', price: 999.99, image_url: 'product-5.jpg' },
  { name: 'Apple Watch', description: 'Series 5 with GPS and Cellular', price: 399.99, image_url: 'product-6.jpg' },
  { name: 'Black Blouse', description: 'Elegant black blouse for any occasion', price: 19.99, image_url: 'product-7.jpg' },
  { name: 'Curology', description: "Custom skincare for your skin's needs", price: 19.95, image_url: 'product-8.jpg' },
  { name: 'Blue leather office chair', description: 'Ergonomic office chair for your comfort', price: 199.99, image_url: 'product-9.jpg' }
]

users_data.each do |user_data|
    user = User.find_or_initialize_by(email: user_data[:email])

    user.assign_attributes(
        password: user_data[:password],
        first_name: user_data[:first_name],
        last_name: user_data[:last_name],
        role: user_data[:role]
    )
    user.save!

    users_ids << user.id
end

items_data.each do |item_data|
    item = Item.find_or_initialize_by(name: item_data[:name])

    item.assign_attributes(
        description: item_data[:description],
        price: item_data[:price],
        image_url: item_data[:image_url]
    )
    item.save!

    items_ids << item.id
end

users = User.where(id: users_ids)
items = Item.where(id: items_ids)

users.each do |user|
    user.orders.each do |order|
        order.order_descriptions.destroy_all
        order.destroy
    end

    rand(2..4).times do
        total_amount = 0
        order = user.orders.create!(amount: 0)

        selected_items = []
        rand(2..4).times do
            item = nil
            until item && !selected_items.include?(item)
                item = items.sample
            end
            selected_items << item

            quantity = rand(1..5)
            order.order_descriptions.create!(item: item, quantity: quantity)
            total_amount += item.price * quantity
        end

        order.update!(amount: total_amount)
    end
end
