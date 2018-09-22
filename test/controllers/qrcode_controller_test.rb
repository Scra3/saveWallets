require 'test_helper'

class QrcodeControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get qrcode_create_url
    assert_response :success
  end

end
