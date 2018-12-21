# frozen_string_literal: true

class ImageService
  def self.upload_image(content, resize = nil)
    input_file = Tempfile.new ['input']
    File.binwrite(input_file.path, content)
    image = MiniMagick::Image.open(input_file.path)
    image.format 'jpeg'
    image.resize resize if resize.present?

    output_file = Tempfile.new ['output', '.jpg']
    image.write(output_file.path)

    content_new = File.binread(output_file.path)
    hash = Digest::MD5.hexdigest content_new
    s3_object = Aws::S3::Resource.new.bucket('galeriders').object("#{hash}.jpg")

    unless s3_object.exists?
      s3_object.put(
        body: content_new,
        content_type: 'image/jpeg',
        acl: 'public-read'
      )
    end

    "https://s3-ap-southeast-2.amazonaws.com/galeriders/#{hash}.jpg"
  end
end
