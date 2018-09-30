class Address < ApplicationRecord
  validates :token, :crypto_name, presence: true

  belongs_to :wallet

  def as_json
    {
      token: token,
      crypto_name: crypto_name
    }
  end
end
