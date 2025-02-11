class CreateOrderDescriptions < ActiveRecord::Migration[8.0]
  def change
    create_table :order_descriptions do |t|
      t.integer :quantity
      t.belongs_to :order, null: false, foreign_key: true
      t.belongs_to :item, null: false, foreign_key: true

      t.timestamps
    end
  end
end
