class CreateWallets < ActiveRecord::Migration[5.2]
  def change
    create_table :wallets do |t|
      t.string :token, index: true, null: false
      t.timestamps
    end

    create_table :addresses do |t|
     t.belongs_to :wallet, index: true, null: false
     t.string :token, null: false
     t.string :crypto_name, null: false
     t.timestamps
   end
  end
end
