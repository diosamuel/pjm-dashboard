import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

// import 'dotenv/config'

const FormLayout = () => {
  const { id } = useParams();

  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
  const changeTextColor = () => setIsOptionSelected(true);
  const [selectedFiles, setSelectedFiles] = useState<any>([]);
  const [formData, setFormData] = useState<any>({
    nama: '',
    deskripsi: '',
    kategori: '',
    stok: '',
    harga: '',
    diskon: '',
    warna: '',
    berat: ''
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFileChange = (event) => {
    if (event.target.files.length > 5) {
      Swal.fire({
        text: `Gambar tidak boleh lebih dari 5!`,
        icon: 'error',
        confirmButtonColor: 'green',
        confirmButtonText: 'Mengerti'
      });
    } else {
      setSelectedFiles(event.target.files);
    }
  };

  useEffect(() => {
    const urlToFile = async (urls) => {
      // urls is an array of image links
      const filePromises = urls.map(async (url) => {
        const response = await axios.get(`${import.meta.env.VITE_API_BACKEND}/api/images/${url}`, {
          responseType: 'blob'
        });
        const data = response.data;
        const metadata = { type: 'image/png' };
        const file = new File([data], `${url}.png`, metadata);
        return file;
      });
      const files = await Promise.all(filePromises);
      return files;
    };

    const fetchData = async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_BACKEND}/api/posts/${id}`);
      let { kategori } = response.data;
      let resKategori =
        kategori === 'bak' ? 1 : kategori === 'box' ? 2 : kategori === 'sparepart' ? 3 : 0;
      let fileImage = await urlToFile(response.data.images);
      setSelectedFiles(fileImage);
      setFormData({ ...response.data, kategori: resKategori });
    };

    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append('nama', formData.nama);
    data.append('deskripsi', formData.deskripsi);
    data.append('kategori', formData.kategori);
    data.append('stok', formData.stok);
    data.append('harga', formData.harga);
    data.append('warna', formData.warna);
    data.append('diskon', formData.diskon);
    data.append('berat', formData.berat);
    Array.from(selectedFiles).forEach((file, index) => data.append('img', file));

    try {
      const token = Cookies.get('access_token');
      const response = await axios.put(
        `${import.meta.env.VITE_API_BACKEND}/api/posts/${id}`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );
      Swal.fire({
        text: `Sukses Memperbarui ${response.data.nama}`,
        icon: 'success',
        showCancelButton: true,
        confirmButtonColor: 'green',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Oke',
        cancelButtonText: 'Lihat Barang'
      }).then((result) => {
        if (!result.isConfirmed) {
          location.href = `${import.meta.env.VITE_API_CLIENT}/toko/katalog/${id}`;
        }
      });
    } catch (error) {
      throw error;
    }
  };

  const removeFile = (index) => {
    const newSelectedFiles = Array.from(selectedFiles).filter((_, i) => i !== index);
    setSelectedFiles(newSelectedFiles);
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tambah Katalog" />
      <div>
        <div className="flex flex-col gap-9 w-full">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">Edit Katalog</h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full">
                    <label className="mb-2.5 block text-black dark:text-white">Nama Barang</label>
                    <input
                      type="text"
                      placeholder="Nama Barang"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      name="nama"
                      onChange={handleInputChange}
                      value={formData.nama}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:gap-6">
                  <div className="mb-4.5 w-full md:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">Harga</label>
                    <input
                      type="number"
                      placeholder="Harga Barang"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      onChange={handleInputChange}
                      name="harga"
                      value={formData.harga}
                      required
                    />
                  </div>
                  <div className="mb-4.5 w-full md:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">Diskon</label>
                    <input
                      type="number"
                      placeholder="Diskon Barang"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      onChange={handleInputChange}
                      name="diskon"
                      value={formData.diskon}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4.5 w-full">
                  <label className="mb-2.5 block text-black dark:text-white">Stok</label>
                  <input
                    type="text"
                    placeholder="Stok Barang"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={handleInputChange}
                    name="stok"
                    value={formData.stok}
                    required
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">Kategori</label>
                  <div className="relative z-20 bg-transparent dark:bg-form-input">
                    <select
                      name="kategori"
                      value={formData.kategori}
                      onChange={(e) => {
                        changeTextColor();
                        handleInputChange(e);
                      }}
                      className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
                        isOptionSelected ? 'text-black dark:text-white' : ''
                      }`}
                      required
                    >
                      <option value="" disabled className="text-body dark:text-bodydark">
                        Pilih Kategori Barang
                      </option>
                      <option value="1" className="text-body dark:text-bodydark">
                        Bak
                      </option>
                      <option value="2" className="text-body dark:text-bodydark">
                        Box
                      </option>
                      <option value="3" className="text-body dark:text-bodydark">
                        Sparepart
                      </option>
                    </select>
                    <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                      <svg
                        className="fill-current"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.8">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                            fill=""
                          ></path>
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">Deskripsi</label>
                  <textarea
                    rows={9}
                    placeholder="Deskripsi Barang"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={handleInputChange}
                    name="deskripsi"
                    value={formData.deskripsi}
                    required
                  ></textarea>
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">Warna Barang</label>
                  <input
                    placeholder="Warna"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={handleInputChange}
                    name="warna"
                    value={formData.warna}
                    required
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">Berat Barang</label>
                  <input
                    placeholder="Berat (kg)"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={handleInputChange}
                    name="berat"
                    value={formData.berat}
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block text-black dark:text-white">Gambar</label>
                  <div className="flex flex-row items-center">
                    <input
                      type="file"
                      id="custom-input"
                      accept=".jpg, .jpeg, .png"
                      onChange={handleFileChange}
                      hidden
                      multiple
                      required
                    />
                    <label
                      htmlFor="custom-input"
                      className="block text-sm mr-4 py-2 px-4 rounded-md border-0 font-semibold bg-blue-800 text-white cursor-pointer"
                    >
                      Choose file
                    </label>
                    <label className="text-sm text-slate-500">Upload File</label>
                  </div>
                  <div className="flex flex-wrap mt-6 gap-2">
                    {Array.from(selectedFiles).map((file, index) => (
                      <div className="flex" key={index}>
                        <img
                          src={URL.createObjectURL(file)}
                          className="w-52 h-56 h-56 object-cover shadow border rounded"
                        />
                        <button
                          className="absolute text-white bg-red-200 text-red-600 font-medium p-1 rounded-full m-2"
                          onClick={(ev) => {
                            event.preventDefault();
                            removeFile(index);
                          }}
                        >
                          <svg
                            className="w-5 h-5 text-red-600"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                  type="submit"
                >
                  Edit Katalog
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default FormLayout;
