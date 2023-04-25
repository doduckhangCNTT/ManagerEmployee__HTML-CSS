# Những việc cần xử lí

1. Xử lí giao diện

   ### HTML & CSS

   - [ ] - Thao tác các thành phần trên giao diện (bật tắt) các thành phần
   - [ ] - Tích hợp `combobox` có xử lí js để có thể lựa chọn
   - [x] - Bật tắt `dialog`, `form`
   - [x] - Bật tắt `form` thêm mới nhân viên
   - [ ] - Xử lí kích thước table khi co nhỏ lại màn hình (có thể thêm thanh scroll)
   - [ ] - Đóng mở thanh `navbar`
   - [ ] - Hiểm `combobox` cho tài khoản

   ### Javascript

   - [ ] - Xử lí trên form
       - [x] - Có thể xử lí lấy dữ liệu trên form
       - [ ] - Validate form
       - [ ] - Áp dụng các convention
       - [x] - Thông báo lỗi bằng cách `hiện đỏ cái thẻ input` đó
       - [x] - Hiển thị thông báo lỗi khi nhấn button `Cất Thêm`
       - [x] - Hiển thị giao diện lỗi trên `form`

2. Cách xử lí các hành vi trên form

   ### Thực thi xử lí form

   - [x] - Viết khung các hàm "role" {selector, test: function)
   - [x] - Xử lí việc lấy dữ liệu trên các thẻ input muốn được validate
   - [x] - Xử lí "blur" khi bấm ra ngoài input
   - [ ] - Xử lí hiển thị thông báo lỗi
       - [x] - Từ thẻ input thì `truy vấn` đến thẻ cha chứa nó (thẻ cha "ngoài cùng")
       - [ ] - Từ thẻ cha thực hiện "chèn" thông báo lỗi đó
   - [x] - Xử lí khi nhập lại vào thẻ input -> thông báo lỗi phải ẩn đi
   - [x] - Một thẻ input thì có thể valid theo nhiều kiểu

3. Xử lí combobox
   - thực hiện bắt sự kiện trên mỗi `mcombobox`
   - Sau đó bắt toàn bộ `options` trên document
   - Bắt sự kiện trên mỗi `options`
     - Lấy giá trị trong option tương ứng
     - Thực hiện tham chiếu ra thẻ cha ngoài cùng và thực hiện truy vấn đến input trong đó
   - Kết nối api và đổ dữ liệu tương ứng cho combobox

- Cách thực hiện thao tác gắn absoulte lên bảng
- Lí do tại sao khi mà lấy dữ liệu từ api đổ ra thì lại không thể hiển thị nội dung absolute đó
