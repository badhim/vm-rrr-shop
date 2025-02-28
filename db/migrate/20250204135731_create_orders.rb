class CreateOrders < ActiveRecord::Migration[8.0]
  def change
    create_table :orders do |t|
      t.float :amount
      t.belongs_to :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
