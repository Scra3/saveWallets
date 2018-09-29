class Address < ApplicationRecord
  validates :token, :crypto_name, presence: true

  belongs_to :wallet
end
