class RemoveDateFromRecords < ActiveRecord::Migration[5.2]
  def change
    remove_column :records, :date, :date
  end
end
